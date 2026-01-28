"use client";

import Header from "@/components/header";
import DatabaseConnection from "@/components/databaseconnection";
import QueryInterface from "@/components/queryinterface";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QueryPage() {
  const router = useRouter();
  const [isAuthenticated, setisAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    setisAuthenticated(true)
  }, [router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Query Your <span className="gradient-text">Database</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect your database, write natural language queries, and view results instantly
            </p>
          </div>
          <DatabaseConnection />
          <QueryInterface />
        </div>
      </main>
      <Footer />
    </div>
  );
} 