"use client";

import { Database, Zap, Shield, BarChart3, Code2, Globe } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate complex SQL queries in seconds. Our AI understands context and generates optimized queries instantly.",
  },

  // {
  //   icon: Database,
  //   title: "Multi-Database Support",
  //   description:
  //     "Works with PostgreSQL, MySQL, SQL Server, Oracle, and more. Connect any database with ease.",
  // },

  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data never leaves your infrastructure. We use secure connections and never store your database contents.",
  },

  // {
  //   icon: BarChart3,
  //   title: "Visual Results",
  //   description:
  //     "Preview your query results with interactive tables and charts. Export data in multiple formats.",
  // },

  {
    icon: Database,
    title: "Schema-Aware Intelligence",
    description:
      "AI automatically analyzes your database schema to generate precise and context-aware SQL queries.",
  },

  {
    icon: Code2,
    title: "One-Click Execution",
    description:
      "Execute AI-generated SQL instantly and preview results without writing code.",
  },

  {
    icon: Globe,
    title: "Natural Language",
    description:
      "Ask questions in plain English. Our AI understands complex requests and business logic.",
  },

  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Run SQL queries instantly and view clean, structured results with no configuration required.",
  },
];


export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
            Everything you need to query your data
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features that make database querying accessible to everyone, from analysts to developers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-500/50 hover:scale-105"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}