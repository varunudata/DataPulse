"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Sparkles,
  Copy,
  Play,
  CheckCircle,
  Download,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// --- Added Recharts for the Dashboard ---
import ChartView from "./chart-view";

export default function QueryEngine() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [copied, setCopied] = useState(false);

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [visualizationTypes, setVisualizationTypes] = useState<string[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (executedQuery && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [executedQuery]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const examplePrompts = [
    "Get me the top 10 customers with highest number of orders",
    "Show me the total sales amount by month",
    "Show me the distribution of order statuses",
  ];

  // --- Logic to detect data types for charts ---
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    const keys = Object.keys(data[0]);

    // Find numeric columns, but IGNORE columns that are likely IDs
    const numericKey = keys.find(k => {
      const isNumeric = typeof data[0][k] === 'number';
      const isId = k.toLowerCase().includes('id');
      return isNumeric && !isId; // Only pick it if it's a number AND not an ID
    });

    // If we didn't find a non-ID number, fallback to any number
    const finalValueKey = numericKey || keys.find(k => typeof data[0][k] === 'number');

    const labelKey = keys.find(k => typeof data[0][k] === 'string') || keys[0];

    return {
      labelKey,
      valueKey: finalValueKey,
      isValid: !!finalValueKey
    };
  }, [data]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedSQL("");
    setData([]);
    setColumns([]);
    setExecutedQuery("");

    try {
      const response = await fetch(`${backendUrl}/api/query/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();
      setGeneratedSQL(result.query || (result.description ? `-- ${result.description}` : "-- No SQL generated"));
    } catch (err) {
      setGeneratedSQL("-- Error generating SQL. Check backend logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunQuery = async () => {
    if (!generatedSQL.trim() || generatedSQL.startsWith("--")) return;

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/query/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, query: generatedSQL }),
      });

      const result = await response.json();
      if (result.queryResult && Array.isArray(result.queryResult)) {
        setData(result.queryResult);
        setColumns(result.queryResult.length > 0 ? Object.keys(result.queryResult[0]) : []);
        setExecutedQuery(generatedSQL);
        setVisualizationTypes(result.visualization || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!data.length) return;
    const csv = [
      columns.join(","),
      ...data.map((row) => columns.map((c) => JSON.stringify(row[c] ?? "")).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "data_export.csv"; a.click();
  };

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ask Anything in Natural Language
              </h2>
              <p className="text-lg text-muted-foreground">
                Describe what you want, and our AI will generate the perfect SQL query.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Your Question</h3>
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Powered
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="Example: Get me the top 10 customers with highest number of orders"
                    className="min-h-[160px] resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example, index) => (
                      <Button key={index} variant="outline" size="sm" className="text-xs" onClick={() => setPrompt(example)}>
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={!prompt || isGenerating}>
                  {isGenerating ? <><Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate SQL Query</>}
                </Button>
              </Card>

              <Card className="p-6 bg-muted/50">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Generated SQL</h3>
                    {generatedSQL && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="Copy SQL query to clipboard">
                          {copied ? <CheckCircle className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />} {copied ? "Copied" : "Copy"}
                        </Button>
                        <Button variant="default" size="sm" onClick={handleRunQuery} disabled={loading || !generatedSQL || generatedSQL.startsWith("--")} aria-label="Execute SQL query" className="bg-blue-600 hover:bg-blue-700 text-white">
                          {loading ? <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> : <Play className="mr-1 h-3 w-3" />} Run
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="bg-card rounded-lg p-4 border min-h-[160px] font-mono text-sm overflow-auto shadow-inner">
                    {generatedSQL ? (
                      <pre className="whitespace-pre-wrap text-black dark:text-white">{generatedSQL}</pre>
                    ) : (
                      <div className="text-muted-foreground flex items-center justify-center h-full">SQL will appear here</div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section ref={resultsRef} className="pb-20 pt-10 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {executedQuery && (
              <Card className="overflow-hidden">
                <div className="border-b bg-muted/50 p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">Query Results</h3>
                        <Badge variant="secondary">{data.length} rows</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleRunQuery}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</Button>
                      <Button variant="outline" size="sm" onClick={handleExport} disabled={!data.length}><Download className="mr-2 h-4 w-4" /> Export</Button>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="table" className="w-full">
                  <div className="border-b px-4">
                    <TabsList className="bg-transparent h-12">
                      <TabsTrigger value="table" className="gap-2">Table View</TabsTrigger>
                      {/* --- Enabled the Chart Tab --- */}
                      <TabsTrigger value="chart" className="gap-2">
                        <BarChart3 className="h-4 w-4" /> Chart View
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="table" className="p-0 m-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {columns.map((col, i) => <TableHead key={i} className="capitalize">{col}</TableHead>)}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.map((row, rIndex) => (
                            <TableRow key={rIndex}>{columns.map((col, cIndex) => <TableCell key={cIndex}>{String(row[col])}</TableCell>)}</TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="chart" className="p-8 m-0 bg-white">
                    <ChartView data={data} visualizationTypes={visualizationTypes} />
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
}