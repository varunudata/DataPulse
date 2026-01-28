"use client";

import { Briefcase, ShoppingCart, LineChart, Users, HeartPulse, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const useCases = [
  {
    icon: Briefcase,
    title: "Business Analysts",
    description: "Extract insights from sales, marketing, and operations data without waiting for IT support.",
    examples: ["Sales performance reports", "Customer segmentation", "Revenue forecasting"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Teams",
    description: "Analyze customer behavior, inventory, and sales trends to optimize your online store.",
    examples: ["Top selling products", "Cart abandonment rates", "Customer lifetime value"],
  },
  {
    icon: LineChart,
    title: "Marketing Teams",
    description: "Measure campaign performance, track conversions, and understand your audience better.",
    examples: ["Campaign ROI analysis", "User engagement metrics", "Attribution modeling"],
  },
  {
    icon: Users,
    title: "Product Managers",
    description: "Track feature usage, user retention, and product metrics to make data-driven decisions.",
    examples: ["Feature adoption rates", "User cohort analysis", "Churn prediction"],
  },
  {
    icon: HeartPulse,
    title: "Healthcare Analytics",
    description: "Analyze patient data, treatment outcomes, and operational efficiency securely.",
    examples: ["Patient outcome tracking", "Resource utilization", "Treatment effectiveness"],
  },
  {
    icon: GraduationCap,
    title: "Education Institutions",
    description: "Track student performance, enrollment trends, and institutional effectiveness.",
    examples: ["Student performance metrics", "Enrollment analytics", "Course effectiveness"],
  },
];

export default function UseCases() {
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
            Built for Every Team
          </h2>
          <p className="text-lg text-muted-foreground">
            From startups to enterprises, teams across industries use DataPulse to unlock their data's potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-card border p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/50"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <useCase.icon className="h-7 w-7" />
              </div>

              <h3 className="mb-2 text-xl font-bold">{useCase.title}</h3>
              <p className="text-muted-foreground mb-4">{useCase.description}</p>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Common Queries:</div>
                <ul className="space-y-1">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}