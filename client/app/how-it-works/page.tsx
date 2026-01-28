"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Database, MessageSquare, Sparkles, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {

  const steps = [
    {
      icon: Database,
      title: "Connect Your Database",
      description:
        "Securely connect to your MySQL database. Your credentials are encrypted in transit and never stored.",
      details: [
        "MySQL support (more databases coming soon)",
        "Secure SSL/TLS connection",
        "Local execution — no data stored",
        "Setup in under 1 minute"
      ]
    },
    {
      icon: MessageSquare,
      title: "Describe What You Need",
      description:
        "Ask questions in plain English. No SQL knowledge required — DataPulse understands your intent and schema.",
      details: [
        "Natural language understanding",
        "Schema-aware query generation",
        "Smart context detection",
        "Works for all query complexity levels"
      ]
    },
    {
      icon: Sparkles,
      title: "AI Generates SQL",
      description:
        "DataPulse instantly converts your request into accurate SQL based on your database structure.",
      details: [
        "Accurate SQL generation",
        "Schema-based optimization",
        "Human-readable explanation",
        "Safe, read-only queries"
      ]
    },
    {
      icon: BarChart3,
      title: "View & Export Results",
      description:
        "Run the query and preview results instantly in a clean, interactive table. Export your data anytime.",
      details: [
        "Interactive data table",
        "Instant query execution",
        "CSV export support",
        "Works with large datasets"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl font-bold mb-6">
              How <span className="text-blue-600 dark:text-blue-400">DataPulse</span> Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From natural language to actionable insights in seconds. Here's how our AI-powered platform transforms the way you query databases.
            </p>
          </motion.div>

          {/* Steps Section */}
          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    STEP {index + 1}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="glass-effect rounded-2xl p-8 shadow-xl">
                    <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-blue-600/5 rounded-lg flex items-center justify-center">
                      <step.icon className="h-24 w-24 text-blue-600/40 dark:text-blue-400/40" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 text-center glass-effect rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and data analysts who are already using DataPulse to accelerate their workflow.
            </p>
            <Link href="/signin">
              <Button size="lg" className="text-base px-8 group cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}