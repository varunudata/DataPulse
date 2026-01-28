"use client";

import { Database, MessageSquare, Sparkles, Download } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Database,
    step: "01",
    title: "Connect Your Database",
    description:
      "Securely connect to your MySQL database with just a few clicks. Your credentials are encrypted in transit and never stored.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Ask in Plain English",
    description:
      "Describe the data you want using everyday language. No need to remember table names or SQL syntax.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "AI Generates SQL",
    description:
      "Our AI analyzes your request and your live database schema to generate accurate, optimized SQL instantly.",
  },
  {
    icon: Download,
    step: "04",
    title: "View & Export Results",
    description:
      "Preview your query results in an interactive table and export them in seconds—no complex setup required.",
  },
];


export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get from question to answer in four simple steps. Start querying your data in minutes, not hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-[60px] top-[100px] w-0.5 h-[calc(100%+2rem)] bg-border" />
              )}

              <div className="flex-shrink-0 relative">
                <div className="flex h-[120px] w-[120px] items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800">
                  <step.icon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                  {step.step}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground text-lg">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

