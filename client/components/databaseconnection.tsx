"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Database,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Badge } from "./ui/badge";

export default function DatabaseConnection() {
  const [status, setStatus] = useState("idle");
  const [dbType, setDbType] = useState("postgresql");
  const [host, setHost] = useState("")
  const [port, setPort] = useState("")
  const [dbName, setDbName] = useState("")
  const [dbUsername, setDbUsername] = useState("")
  const [dbPassword, setDbPassword] = useState("")

  useEffect(() => {
    const savedCreds = sessionStorage.getItem("dbCredentials");
    if (savedCreds) {
      try {
        const parsed = JSON.parse(savedCreds);
        setHost(parsed.host || "");
        setPort(parsed.port || "");
        setDbName(parsed.database || "");
        setDbUsername(parsed.user || "");
        setDbPassword(parsed.password || "");

        // Auto-connect if credentials exist
        connectToDb(parsed);
      } catch (e) {
        console.error("Failed to parse saved credentials", e);
      }
    }
  }, []);

  const fillDemoCredentials = () => {
    // Demo credentials from environment variables
    setHost(process.env.NEXT_PUBLIC_DEMO_DB_HOST || "");
    setPort(process.env.NEXT_PUBLIC_DEMO_DB_PORT || "");
    setDbName(process.env.NEXT_PUBLIC_DEMO_DB_NAME || "");
    setDbUsername(process.env.NEXT_PUBLIC_DEMO_DB_USER || "");
    setDbPassword(process.env.NEXT_PUBLIC_DEMO_DB_PASSWORD || "");
  };

  const connectToDb = async (creds: any) => {
    setStatus("connecting");
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const res = await fetch(`${backendUrl}/api/db/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          host: creds.host,
          port: Number(creds.port),
          user: creds.user,
          password: creds.password,
          database: creds.database
        })
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.message || "Connection failed")
      }
      setStatus("connected");

      // Save to session storage on success
      sessionStorage.setItem("dbCredentials", JSON.stringify(creds));
    } catch (error) {
      console.error("Connection Error:", error);
      setStatus("error");
    }
  };

  const handleConnect = () => {
    connectToDb({
      host,
      port,
      user: dbUsername,
      password: dbPassword,
      database: dbName
    });
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "connecting":
        return (
          <Badge variant="secondary" className="gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Connecting...
          </Badge>
        );
      case "connected":
        return (
          <Badge className="gap-2 bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="gap-2">
            <AlertCircle className="h-3 w-3" />
            Connection Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-2">
            <Database className="h-3 w-3" />
            Not Connected
          </Badge>
        );
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Connect Your Database
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Securely connect to your database in seconds. We support all major
              database systems.
            </p>
            {/* <div className="max-w-2xl mx-auto p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                ⚠️ <strong>Important:</strong> For security, use read-only credentials or a development database. Never enter production credentials with write access.
              </p>
            </div> */}
          </div>

          {/* Connection Form */}
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Database Credentials</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  className="gap-2 hidden sm:flex"
                  title="Use Demo Credentials"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Use Demo Data
                </Button>
                {getStatusDisplay()}
              </div>
            </div>

            <div className="space-y-4">
              {/* Database Type */}
              {/* <div className="space-y-2">
                <Label htmlFor="db-type">Database Type</Label>
                <Select value={dbType} onValueChange={setDbType}>
                  <SelectTrigger id="db-type">
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="sqlserver">SQL Server</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input id="host" placeholder="localhost" value={host} onChange={(e) => setHost(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    placeholder="5432"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    type="number"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="database">Database Name</Label>
                <Input id="database" placeholder="my_database" value={dbName} onChange={(e) => setDbName(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="user" value={dbUsername} onChange={(e) => setDbUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={dbPassword} onChange={(e) => setDbPassword(e.target.value)} />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleConnect}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={status === "connecting" || status === "connected"}
                >
                  {status === "connecting" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : status === "connected" ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Connected Successfully
                    </>
                  ) : status === "error" ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Retry Connection
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Connect to Database
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                🔒 Your credentials are encrypted and never stored on our
                servers
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
