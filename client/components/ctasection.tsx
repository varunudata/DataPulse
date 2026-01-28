"use client";

import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-background dark:from-blue-950/20 dark:via-blue-900/10 dark:to-background border-2 border-blue-200 dark:border-blue-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,theme(colors.blue.500/8%),transparent)]" />

            <div className="text-center space-y-6">

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-4 py-1.5 text-sm">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">Get Started Today</span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Turn Natural Language Into SQL — Instantly
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create your free account to start generating AI-powered SQL queries.
                No credit card required — just sign up and start querying.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="text-base px-8 group cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </Button>
                </Link>

                <Link href="/query">
                  <Button size="lg" variant="outline" className="text-base px-8 cursor-pointer">
                    Try DataPulse
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">

                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Free account</span>
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>No credit card required</span>
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Start in under 1 minute</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
