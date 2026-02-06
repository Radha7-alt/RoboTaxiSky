"use client";

import { motion } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  FileText,
  ExternalLink,
  Code2,
} from "lucide-react";
import { PageTitle } from "@/components/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function HelpPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const faqs = [
    {
      question: "What is RoboTaxiSky?",
      answer:
        "RoboTaxiSky is a research-grade dashboard for visualizing, analyzing, and exploring public discussions about robotaxis (autonomous taxis) on the Bluesky platform. It ingests public posts in real time via the Firehose API, processes them through an NLP pipeline, and generates insights into sentiment, emotion, topic trends, and discussion dynamics. The dashboard supports both high-level monitoring and deeper investigation of emerging narratives, making it useful for researchers, engineers, analysts, and policymakers.",
    },
    {
      question: "How is the data collected?",
      answer:
        "Posts are collected from Bluesky's public Firehose stream 24/7 and filtered using robotaxi-related keyword and hashtag matching (e.g., robotaxi, Waymo, Cruise, Zoox, autonomous taxi, driverless, etc.). The data is stored in Supabase as the initial ingestion layer. A labeling pipeline classifies each post with sentiment and emotion labels using transformer-based models, and assigns topics using unsupervised topic modeling (TF-IDF + NMF). Labeled data is migrated to a local-first SQLite-compatible Turso database optimized for analysis and snapshot generation.",
    },
    {
      question: "How frequently is the data updated?",
      answer:
        "Data ingestion runs continuously, while labeling, topic modeling, and snapshot generation run on a daily cadence. This keeps the dashboard current for near-real-time monitoring while also producing consistent day-by-day summaries. Summary artifacts such as volume trends, sentiment/emotion distributions, hashtags/emojis, and topic breakdowns are recalculated daily and stored as JSON files for the dashboard to consume.",
    },
    {
      question: "What are the sentiment labels and how are they determined?",
      answer:
        "Sentiment labels include Positive, Neutral, and Negative. These are inferred using a RoBERTa-based sentiment model trained for short social text. Positive often reflects excitement, optimism, or approval (e.g., “amazing ride”), Neutral includes factual reporting (e.g., location updates, links, announcements), and Negative captures criticism, concern, or frustration (e.g., safety worries, incidents, traffic issues). The dashboard also correlates sentiment trends with hashtags and emojis.",
    },
    {
      question: "How is emotion detection handled?",
      answer:
        "Emotions are classified using a transformer model that supports fine-grained categories such as joy, sadness, anger, fear, surprise, and love. Each post is tagged with the most probable emotion, and distributions are tracked over time and by topic to understand how public reaction changes around robotaxi-related events and discussions.",
    },
    {
      question: "How are topics generated?",
      answer:
        "Topics are derived using an unsupervised machine learning approach. Posts are vectorized using TF-IDF, and NMF (Non-negative Matrix Factorization) is used to extract latent topics. Each topic includes top keywords and is tracked for daily volume, sentiment, emotion, and associated hashtags/emojis. This helps you explore emerging robotaxi narratives such as safety, regulation, product updates, service areas, rider experiences, and incidents.",
    },
    {
      question: "What does the Word Cloud show?",
      answer:
        "The Word Cloud visualizes the most frequent hashtags or emojis used in robotaxi-related posts, either globally or filtered by sentiment/emotion/topic. It updates based on recent rolling windows (depending on your snapshot configuration), helping identify trending terms, symbols, and themes in the conversation.",
    },
    {
      question: "How is historical data handled?",
      answer:
        "All labeled posts are stored in Turso, enabling full historical analysis. Snapshots of summary statistics are computed and saved per day. The dashboard visualizes both aggregate statistics (e.g., total posts, top hashtags) and time-series patterns over recent windows. Older data can be retained for longitudinal analysis and can be queried programmatically if needed.",
    },
    {
      question: "What infrastructure powers RoboTaxiSky?",
      answer:
        "RoboTaxiSky uses a modular architecture: ingestion via a Node.js-based Firehose listener, initial storage in Supabase, labeling with Python + Hugging Face models, and summary/snapshot generation using scikit-learn plus libsql/Turso for local-first analytics. Components can be orchestrated using automation (e.g., scheduled jobs) and environment-configured pipelines for reproducibility and low operational overhead.",
    },
    {
      question: "Can I use this data for research or policy work?",
      answer:
        "Yes. Analyses are based on publicly available posts and should be used with care and ethical consideration. The dashboard supports exploration for academic research, transportation policy, public safety analysis, product research, and communications monitoring. Daily JSON summaries can be exported and version-controlled to improve transparency and reproducibility.",
    },
  ];

  return (
    <>
      <PageTitle
        title="Help & Documentation"
        description="Learn how to use the RoboTaxiSky dashboard"
        icon={<HelpCircle size={28} />}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item} className="col-span-1 md:col-span-2">
          <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-sky-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about the RoboTaxiSky dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-1">
          <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-sky-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Resources</CardTitle>
              <CardDescription>
                Technical references and tools for working with RoboTaxiSky
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <ExternalLink className="h-8 w-8 mr-2 text-sky-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Project Overview</h3>
                    <p className="text-sm text-gray-500">
                      Overview of the RoboTaxiSky ecosystem including ingestion,
                      labeling, snapshots, and dashboard features.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className="h-8 w-8 mr-2 text-sky-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Data & Schema Notes</h3>
                    <p className="text-sm text-gray-500">
                      JSON formats and schema guides for integrating summary
                      outputs into your own tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Code2 className="h-8 w-8 mr-2 text-sky-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Pipeline Source Code</h3>
                    <p className="text-sm text-gray-500">
                      Node.js ingestion worker plus Python scripts for NLP
                      labeling, topic modeling, and Turso-based analytics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageSquare className="h-8 w-8 mr-2 text-sky-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Discussion & Support</h3>
                    <p className="text-sm text-gray-500">
                      Report issues, ask questions, or suggest improvements for
                      robotaxi discussion tracking and analysis.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Link
                href="https://github.com/gauravfs-14/CognitiveSky"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full cursor-pointer"
              >
                <Button variant="outline" className="w-full cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" /> View GitHub
                  Repository
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-1 md:col-span-3">
          <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-sky-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Need Assistance?</CardTitle>
              <CardDescription>
                We&apos;re here to help you get the most out of RoboTaxiSky
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="text-center py-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Found a bug, need help with setup, or want a feature request?
                  Join the conversation or open an issue on GitHub.
                </p>
                <Link
                  href="https://github.com/gauravfs-14/CognitiveSky/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <Button className={"cursor-pointer"}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Open GitHub Issue
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}
