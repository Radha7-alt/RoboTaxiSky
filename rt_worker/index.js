import { Firehose } from "@atproto/sync";
import { IdResolver } from "@atproto/identity";
import supabase from "./utils/db.js";

const ROBOTAXI_KEYWORDS = [
  // General robotaxi terms
  "robotaxi", "robo taxi", "robo-taxi",
  "autonomous taxi", "self-driving taxi", "self driving taxi",
  "driverless taxi", "driverless cab", "autonomous cab",

  // Autonomous vehicle terms (broader)
  "autonomous vehicle", "self-driving car", "self driving car", "driverless car",
  "av", "autonomy",

  // Companies / services
  "waymo", "waymo one",
  "cruise", "gm cruise",
  "zoox",
  "apollo go", "baidu apollo",
  "pony.ai", "weride", "autox",

  // Common discussion topics
  "driverless ride", "no driver",
  "robotaxi safety", "av safety",
  "robotaxi crash", "robotaxi accident", "robotaxi incident",
  "self-driving crash", "self-driving accident",
  "stuck robotaxi", "blocked traffic", "stalled", "pulled over",

  // Hashtags (Bluesky posts can include them)
  "#robotaxi", "#robotaxis", "#waymo", "#cruise", "#zoox",
  "#selfdriving", "#autonomousvehicles",
];


// Precompile keyword regexes
const robotaxiRegexes = ROBOTAXI_KEYWORDS.map(
  (kw) =>
    new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i")
);

function isRobotaxiPost(text = "") {
  return robotaxiRegexes.some((regex) => regex.test(text));
}

// === Insert Queue Config ===
const INSERT_BATCH_SIZE = 100;
const INSERT_INTERVAL_MS = 5000;
const MAX_QUEUE_LENGTH = 1000;
const MAX_RETRIES = 3;

let insertQueue = [];
let isInserting = false;

// // === Optional: Memory Monitor ===
// setInterval(() => {
//   const mem = process.memoryUsage();
//   console.log(`[MEMORY] RSS: ${(mem.rss / 1024 / 1024).toFixed(2)}MB`);
// }, 60000);

// === Flush Queue Safely ===
const flushQueue = async () => {
  if (insertQueue.length === 0 || isInserting) return;

  isInserting = true;
  const batch = insertQueue.splice(0, INSERT_BATCH_SIZE);

  try {
    const { error } = await supabase.from("posts_unlabeled").insert(batch);
    if (error) {
      console.error("❌ Supabase batch insert error:", error.message);
      // Mark retries and requeue if within limit
      batch.forEach((item) => {
        item._retries = (item._retries || 0) + 1;
      });
      const retryable = batch.filter((item) => item._retries <= MAX_RETRIES);
      if (retryable.length > 0) {
        insertQueue.unshift(...retryable);
      }
    } else {
      console.log(`✅ Inserted batch of ${batch.length}`);
    }
  } catch (err) {
    console.error("🔥 Unexpected insert error:", err.stack || err);
    batch.forEach((item) => {
      item._retries = (item._retries || 0) + 1;
    });
    const retryable = batch.filter((item) => item._retries <= MAX_RETRIES);
    if (retryable.length > 0) {
      insertQueue.unshift(...retryable);
    }
  }

  isInserting = false;

  // Truncate queue if too large
  if (insertQueue.length > MAX_QUEUE_LENGTH) {
    insertQueue = insertQueue.slice(-MAX_QUEUE_LENGTH);
  }
};

setInterval(flushQueue, INSERT_INTERVAL_MS);

// === Graceful Shutdown ===
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down — flushing remaining posts...");
  await flushQueue();
  process.exit(0);
});

// === Firehose Setup ===
const idResolver = new IdResolver();
let firehoseStarted = false;

const firehose = new Firehose({
  service: "wss://bsky.network",
  idResolver,
  filterCollections: ["app.bsky.feed.post"],

  handleEvent: async (evt) => {
    try {
      if (evt.event !== "create") return;
      const post = evt.record;
      if (!post?.text || post.reply) return;
      if (post?.$type !== "app.bsky.feed.post") return;
      if (!isRobotaxiPost(post.text)) return;
      if (!evt.did) return;

      const record = {
        uri: evt.uri.toString(),
        did: evt.did,
        text: post.text,
        created_at: post.createdAt || evt.time,
        langs: post.langs || [],
        facets: post.facets || null,
        reply: null,
        embed: post.embed || null,
        ingestion_time: new Date().toISOString(),
      };

      insertQueue.push(record);

      if (insertQueue.length >= INSERT_BATCH_SIZE * 2) {
        console.log("⚠️ Queue large — flushing early...");
        await flushQueue();
      }
    } catch (err) {
      console.error("🔥 Event handler error:", err.stack || err);
    }
  },

  onError: (err) => {
    console.error("🔥 Firehose stream error:", err.stack || err);
  },
});

if (!firehoseStarted) {
  firehoseStarted = true;
  firehose.start();
  console.log("🚀 Firehose started.");
}
