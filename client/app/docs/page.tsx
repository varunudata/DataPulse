"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Book, Code, Database, Zap, Shield, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DocsPage() {
  const sections = [
    {
      icon: Book,
      title: "Getting Started",
      items: [
        "Project Overview",
        "Requirements",
        "Installation Guide",
        "Folder Structure Overview"
      ]
    },
    {
      icon: Database,
      title: "MySQL Setup",
      items: [
        "Local MySQL Setup",
        "Connecting Your Database",
        "Environment Variables",
        "Testing Your Connection"
      ]
    },
    {
      icon: Code,
      title: "Query Writing",
      items: [
        "Natural Language to SQL",
        "Supported Query Types",
        "Limitations",
        "Best Practices"
      ]
    },
    {
      icon: Zap,
      title: "Authentication",
      items: [
        "JWT Authentication",
        "Signup & Login Flow",
        "Storing Tokens in LocalStorage",
        "Protected Routes"
      ]
    },
    {
      icon: Shield,
      title: "Security",
      items: [
        "Handling Credentials Safely",
        "Backend Validation",
        "Preventing SQL Injection",
        "Rate Limiting (Future)"
      ]
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      items: [
        "Database Connection Issues",
        "Invalid Token Errors",
        "CORS Problems",
        "Common Query Errors"
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
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-blue-600 dark:text-blue-400">Documentation</span> & Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about using DataPulse. From getting started to advanced features.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full px-6 py-4 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>

          {/* Documentation Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <section.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2"
                      >
                        <span className="h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Quick Start Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8">Quick Start Guide</h2>
            <div className="glass-effect rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Connect Your Database</h3>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                  <code>
                    {`// Example connection string
                        const dbConfig = {
                          host: "your-host.com",
                          port: 5432,
                          database: "your_database",
                          user: "your_username",
                          password: "your_password"
                        };`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Write Your First Query</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground mb-2">Natural Language:</p>
                  <p className="font-medium mb-4">"Get me the top 5 customers with the highest orders"</p>
                  <p className="text-muted-foreground mb-2">Generated SQL:</p>
                  <div className="font-mono text-sm">
                    <code>
                      {`SELECT customer_name, COUNT(*) as order_count
FROM orders
GROUP BY customer_name
ORDER BY order_count DESC
LIMIT 5;`}
                    </code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. View Results</h3>
                <p className="text-muted-foreground">
                  Results are displayed in an interactive table with options to view as charts, export to various formats, and share with your team.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Support CTA */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 text-center glass-effect rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Need More Help?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Contact Support
              </button>
              <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                Join Community
              </button>
            </div>
          </motion.div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}