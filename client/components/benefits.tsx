"use client";

import { Clock, TrendingUp, Users, Lock, Gauge, Brain } from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Clock,
    title: "Save 10+ Hours Per Week",
    description:
      "Eliminate time spent writing and debugging SQL queries. Focus on insights instead of manual query writing.",
    stat: "90%",
    statLabel: "Time Saved",
  },
  {
    icon: TrendingUp,
    title: "Increase Productivity",
    description:
      "Empower anyone to query data independently—no need to rely on SQL experts or engineering teams.",
    stat: "3x",
    statLabel: "Faster Insights",
  },
  {
    icon: Brain,
    title: "No SQL Knowledge Required",
    description:
      "Query data using natural language. Perfect for analysts, students, and business users.",
    stat: "100%",
    statLabel: "Accessibility",
  },
  {
    icon: Gauge,
    title: "Accurate SQL Every Time",
    description:
      "AI generates precise and schema-aware SQL queries tailored to your actual database structure.",
    stat: "99%",
    statLabel: "Accuracy",
  },
  {
    icon: Users,
    title: "Export & Analyze Anywhere",
    description:
      "Instantly export data to CSV and use it in Excel, Google Sheets, or BI tools—your workflow, your choice.",
    stat: "∞",
    statLabel: "Flexibility",
  },
  {
    icon: Lock,
    title: "Encrypted & Local Processing",
    description:
      "Your credentials are never stored. Queries run directly against your connected database using secure channels.",
    stat: "100%",
    statLabel: "Privacy",
  },
];


export default function Benefits() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
            Why Choose DataPulse
          </h2>
          <p className="text-lg text-muted-foreground">
            Transform how your team works with data. Faster insights, better decisions, and happier teams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/50 h-full">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{benefit.stat}</div>
                    <div className="text-xs text-muted-foreground">{benefit.statLabel}</div>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}