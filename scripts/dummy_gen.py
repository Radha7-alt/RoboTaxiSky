import json
import datetime
import random
import os

def random_choice_weighted(choices):
    items, weights = zip(*choices.items())
    return random.choices(items, weights=weights)[0]

def generate_dummy_json_files(output_dir="summary_ref", days=7):
    os.makedirs(output_dir, exist_ok=True)
    today = datetime.date.today()
    dates = [(today - datetime.timedelta(days=i)).isoformat() for i in reversed(range(days))]

    # Robotaxi-oriented distributions
    sentiments = {"positive": 0.35, "neutral": 0.45, "negative": 0.20}
    emotions = {
        "joy": 0.15,
        "sadness": 0.05,
        "fear": 0.15,
        "neutral": 0.50,
        "anger": 0.10,
        "surprise": 0.05,
    }
    languages = {"english": 0.75, "spanish": 0.15, "french": 0.10}

    # Robotaxi hashtags + emojis
    hashtags = [
        "#Robotaxi",
        "#RoboTaxi",
        "#SelfDriving",
        "#AutonomousVehicles",
        "#Waymo",
        "#Cruise",
        "#Zoox",
        "#AVSafety",
        "#Driverless",
        "#Autonomy",
        "#FutureOfTransport",
        "#Transportation",
    ]
    emojis = ["🚕", "🤖", "🛣️", "⚠️", "✅", "😮", "😡", "😬"]

    # Robotaxi topics (labels are what the dashboard will show)
    topics = {
        "topic_0": ["waymo", "ride", "phoenix", "sf", "service"],
        "topic_1": ["safety", "incident", "crash", "rules", "testing"],
        "topic_2": ["traffic", "stuck", "blocked", "pulled", "over"],
        "topic_3": ["policy", "regulation", "city", "permits", "government"],
        "topic_4": ["technology", "lidar", "sensors", "mapping", "software"],
    }

    # meta.json
    meta = {
        "date": today.isoformat(),
        "complete": {
            "total_posts": 15000,
            "total_sentiments": len(sentiments),
            "total_emotions": len(emotions),
            "total_languages": len(languages),
            "total_topics": len(topics),
            "total_hashtags": len(hashtags),
            "total_emojis": len(emojis),
        },
        "last_week": {
            "total_posts": 1400,
            "total_sentiments": len(sentiments),
            "total_emotions": len(emotions),
            "total_languages": len(languages),
            "total_topics": len(topics),
            "total_hashtags": min(25, len(hashtags)),
            "total_emojis": min(15, len(emojis)),
        },
        "averages": {
            "avg_posts_per_day": 200,
            "avg_hashtags_per_day": 18,
            "avg_emojis_per_day": 12
        },
        "top": {
            "sentiment": "neutral",
            "emotion": "neutral",
            "language": "english",
            "hashtag": "#Robotaxi",
            "emoji": "🚕"
        }
    }
    with open(f"{output_dir}/meta.json", "w") as f:
        json.dump(meta, f, indent=2)

    # activity.json
    activity = {}
    for d in dates:
        sentiment_counts = {k: random.randint(10, 140) for k in sentiments}
        emotion_counts = {k: random.randint(5, 140) for k in emotions}
        language_counts = {k: random.randint(0, 120) for k in languages}
        volume = sum(sentiment_counts.values())
        activity[d] = {
            "volume": volume,
            "sentiment": sentiment_counts,
            "emotion": emotion_counts,
            "language": language_counts,
        }
    with open(f"{output_dir}/activity.json", "w") as f:
        json.dump(activity, f, indent=2)

    # hashtags.json
    hashtags_daily = {}
    for d in dates:
        counts = {tag: random.randint(0, 35) for tag in hashtags}
        hashtags_daily[d] = {k: v for k, v in counts.items() if v > 0}
    with open(f"{output_dir}/hashtags.json", "w") as f:
        json.dump(hashtags_daily, f, indent=2)

    # emojis.json
    emojis_daily = {}
    for d in dates:
        counts = {em: random.randint(0, 35) for em in emojis}
        emojis_daily[d] = {k: v for k, v in counts.items() if v > 0}
    with open(f"{output_dir}/emojis.json", "w") as f:
        json.dump(emojis_daily, f, indent=2)

    # topics.json
    topics_json = {}
    for topic, labels in topics.items():
        count = random.randint(25, 180)
        daily = {d: random.randint(0, 40) for d in dates}
        sentiment = {k: random.randint(0, 80) for k in sentiments}
        emotion = {k: random.randint(0, 80) for k in emotions}
        hashtags_list = random.sample(hashtags, k=4)
        emojis_list = random.sample(emojis, k=3)
        topics_json[topic] = {
            "label": labels,
            "count": count,
            "daily": {k: v for k, v in daily.items() if v > 0},
            "sentiment": sentiment,
            "emotion": emotion,
            "hashtags": hashtags_list,
            "emojis": emojis_list,
        }
    with open(f"{output_dir}/topics.json", "w") as f:
        json.dump(topics_json, f, indent=2)

    # emoji_sentiment.json
    emoji_sentiment = {
        "positive": {"✅": 110, "🚕": 90, "🤖": 60},
        "negative": {"⚠️": 95, "😡": 55, "😬": 45},
        "neutral": {"🛣️": 70, "😮": 35}
    }
    with open(f"{output_dir}/emoji_sentiment.json", "w") as f:
        json.dump(emoji_sentiment, f, indent=2)

    # hashtag_graph.json
    hashtag_graph = [
        {"source": "#Robotaxi", "target": "#Waymo", "weight": 25},
        {"source": "#Robotaxi", "target": "#AVSafety", "weight": 18},
        {"source": "#SelfDriving", "target": "#AutonomousVehicles", "weight": 20},
        {"source": "#Driverless", "target": "#Autonomy", "weight": 14},
    ]
    with open(f"{output_dir}/hashtag_graph.json", "w") as f:
        json.dump(hashtag_graph, f, indent=2)

    # sentiment_by_topic.json
    sentiment_by_topic = {}
    for topic in topics:
        sentiment_by_topic[topic] = {k: random.randint(10, 120) for k in sentiments}
    with open(f"{output_dir}/sentiment_by_topic.json", "w") as f:
        json.dump(sentiment_by_topic, f, indent=2)

    # emotion_by_topic.json
    emotion_by_topic = {}
    for topic in topics:
        emotion_by_topic[topic] = {k: random.randint(5, 120) for k in emotions}
    with open(f"{output_dir}/emotion_by_topic.json", "w") as f:
        json.dump(emotion_by_topic, f, indent=2)

if __name__ == "__main__":
    generate_dummy_json_files()
