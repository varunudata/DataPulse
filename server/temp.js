// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import mysql from "mysql2/promise";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const PORT = process.env.PORT || 4000;
// const app = express();

// const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API);

// app.use(express.json());
// app.use(cors());

// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   database: process.env.DB_NAME,
// // });

// let pool;
// let connectedDbName;

// const systemPrompt = `You are an expert Database Assistant and Data Engineer, acting as a JSON API.
// Your goal is to help users interact with and understand their database.

// ---
// ### CORE DIRECTIVE
// **You MUST ALWAYS respond with a single, valid JSON object.** Do NOT include any text, notes, or explanations outside of the JSON structure.

// ---
// ### CONTEXT
// The user will provide a database schema. You must ONLY use the information present in this schema.
// *   Do NOT hallucinate table names, column names, or relationships.
// *   Use MySQL dialect for all SQL queries.

// ---
// ### JSON RESPONSE SCHEMA
// Your JSON output must conform to the following structure:
// {
//   "components": ["string"],
//   "query": "string" | null,
//   "description": "string"
// }

// ---
// ### LOGIC FOR THE 'components' ARRAY
// This array declares the intended components for the response. You must decide which components are necessary based on the user's request.

// 1.  **If the user asks a question that requires running a query to get an answer** (e.g., "How many...", "Show me...", "Who is..."), the array MUST include all three components: \`["query", "description", "data"]\`.
//     *   \`"query"\`: The SQL query to answer the question.
//     *   \`"description"\`: A human-readable explanation of the query.
//     *   \`"data"\`: A signal that the application should execute the query and present the resulting data to the user.

// 2.  **If the user asks for an explanation, documentation, or clarification about the schema** (e.g., "Explain the users table", "How do orders and products relate?"), the array MUST include only one component: \`["description"]\`.
//     *   The \`query\` key in the JSON should be \`null\`.
//     *   The \`description\` should contain the full explanation.

// 3.  **If the user's request is ambiguous or cannot be answered from the schema**, the array MUST be \`["description"]\`.
//     *   The \`query\` key must be \`null\`.
//     *   The \`description\` should contain a clarifying question.

// ---
// ### EXAMPLES

// **User Request:** "Show me the top 5 most recent orders"
// **Your Response:**
// {
//   "components": ["query", "description", "data"],
//   "query": "SELECT order_id, customer_id, order_date, total_order_amount FROM orders ORDER BY order_date DESC LIMIT 5;",
//   "description": "This query retrieves the five most recent orders by sorting them by the order date in descending order."
// }

// **User Request:** "what is the customers table for"
// **Your Response:**
// {
//   "components": ["description"],
//   "query": null,
//   "description": "The \`customers\` table stores essential information about your customers, including their name and location. It is linked to the \`orders\` table via the \`customer_id\` to track who placed each order."
// }
// `;

// function extractJsonFromString(rawString) {
//   if (typeof rawString !== "string") return "";
//   const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
//   const match = rawString.match(jsonRegex);
//   if (match && match[1]) {
//     return match[1].trim();
//   }
//   return rawString.trim();
// }

// const geminiApi = async (systemInstructions, schemaContext, userQuestion) => {
//   const model = genAi.getGenerativeModel({
//     model: "gemini-2.0-flash",
//     systemInstruction: systemInstructions,
//   });
//   const fullUserPrompt = `Here is the database schema:\n${schemaContext}\n\nMy question is: "${userQuestion}"`;

//   try {
//     const result = await model.generateContent(fullUserPrompt);
//     return result.response.candidates[0].content.parts[0].text;
//   } catch (error) {
//     console.error("Error during Gemini API call:", error);
//     return JSON.stringify({
//       components: ["description"],
//       query: null,
//       description: "There was an error communicating with the AI service.",
//     });
//   }
// };

// app.get("/", (req, res) => {
//   res.send("Server is running and responding!");
// });

// app.post("/api/connect", async (req, res) => {
//   const { host, port, dbName, dbUsername, dbPassword } = req.body;
//   if (!host || !dbName || !dbUsername) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required database credentials",
//     });
//   }
//   try {
//     if (pool) {
//       await pool.end();
//       pool = null;
//       console.log("Previous connection pool closed.");
//     }
//     const newPool = mysql.createPool({
//       host,
//       port,
//       user: dbUsername,
//       password: dbPassword,
//       database: dbName,
//       connectionLimit: 10,
//       waitForConnections: true,
//     });
//     const connection = await newPool.getConnection();
//     console.log("Data base connection test successful");
//     connection.release();

//     pool = newPool;
//     connectedDbName = dbName;
//     console.log(`Successfully connected to database: ${dbName}`);
//     res
//       .status(200)
//       .json({ success: true, message: "Data base connected successfully " });
//   } catch (error) {
//     console.log("Data base conenction failed rwfd", error);
//     return res.status(400).json({
//       success: false,
//       message: "Connection failed please check your credentials",
//     });
//   }
// });

// app.post("/api/schema", async (req, res) => {
//   if (!pool || !connectedDbName) {
//     return res.status(400).json({
//       success: false,
//       message:
//         "Data base is not connected ! Please coneect to the database via conenction form",
//     });
//   }
//   const { prompt } = req.body;
//   if (!prompt) {
//     return res.status(400).json({ error: "A 'prompt' is required." });
//   }

//   try {
//     const [tables] = await pool.query(
//       `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
//       [connectedDbName]
//     );
//     if (tables.length === 0) {
//       return res.status(404).json({ error: "No tables found in database." });
//     }

//     let schemaText = "";
//     for (const table of tables) {
//       const tableName = table.TABLE_NAME;
//       const [columns] = await pool.query(
//         `SELECT c.COLUMN_NAME, c.COLUMN_TYPE, c.IS_NULLABLE, c.COLUMN_KEY, c.COLUMN_DEFAULT, c.EXTRA, kcu.REFERENCED_TABLE_NAME AS referenced_table, kcu.REFERENCED_COLUMN_NAME AS referenced_column FROM INFORMATION_SCHEMA.COLUMNS c LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON c.TABLE_SCHEMA = kcu.TABLE_SCHEMA AND c.TABLE_NAME = kcu.TABLE_NAME AND c.COLUMN_NAME = kcu.COLUMN_NAME AND kcu.REFERENCED_TABLE_NAME IS NOT NULL WHERE c.TABLE_SCHEMA = ? AND c.TABLE_NAME = ?`,
//         [connectedDbName, tableName]
//       );
//       schemaText += `Table: ${tableName}\n`;
//       schemaText += columns
//         .map(
//           (col) =>
//             `${col.COLUMN_NAME} (${col.COLUMN_TYPE})${
//               col.IS_NULLABLE === "NO" ? " NOT NULL" : ""
//             }${col.COLUMN_KEY ? " " + col.COLUMN_KEY : ""}${
//               col.referenced_table
//                 ? ` REFERENCES ${col.referenced_table}(${col.referenced_column})`
//                 : ""
//             }${col.EXTRA ? " " + col.EXTRA : ""}${
//               col.COLUMN_DEFAULT !== null
//                 ? " DEFAULT " + col.COLUMN_DEFAULT
//                 : ""
//             }`
//         )
//         .join("\n");
//       schemaText += "\n\n";
//     }

//     const rawAiResponse = await geminiApi(systemPrompt, schemaText, prompt);

//     let structuredResponse;
//     try {
//       const cleanedString = extractJsonFromString(rawAiResponse);
//       if (cleanedString) {
//         structuredResponse = JSON.parse(cleanedString);
//       } else {
//         throw new Error("Cleaned string is empty, cannot parse.");
//       }
//     } catch (e) {
//       console.error(
//         "Failed to parse AI JSON response. The raw response was:",
//         rawAiResponse
//       );
//       structuredResponse = {
//         components: ["description"],
//         query: null,
//         description:
//           "Sorry, I encountered an issue generating a valid response. Please try rephrasing.",
//       };
//     }
//     let queryResult = null;
//     if (structuredResponse.query) {
//       try {
//         const [rows] = await pool.query(structuredResponse.query);
//         queryResult = rows;
//         structuredResponse.queryResult = queryResult;
//       } catch (queryError) {
//         console.error("Error executing AI query:", queryError.message);
//         queryResult = { error: "Failed to execute AI-generated query." };
//       }
//     }
//     console.log("✅ Structured response:", structuredResponse);
//     res.json(structuredResponse);
//   } catch (error) {
//     console.error("Server Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// index.js / server.js

// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import mysql from "mysql2/promise";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const PORT = process.env.PORT || 4000;
// const app = express();

// // --------------------
// // 1. BASIC SETUP
// // --------------------

// app.use(express.json());
// app.use(cors());

// // Gemini client
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

// // MySQL pool + state
// let pool = null;
// let connectedDbName = null;
// let cachedSchemaText = null; // cache schema for current DB

// // --------------------
// // 2. SYSTEM PROMPT
// // --------------------

// const systemPrompt = `You are an expert Database Assistant and Data Engineer, acting strictly as a JSON API.

// YOUR OUTPUT RULE:
// - You MUST ALWAYS respond with a single valid JSON object.
// - DO NOT include Markdown, code fences, extra text, or explanations outside of the JSON.
// - DO NOT wrap the JSON in backticks.

// DATABASE:
// - The database is MySQL.
// - Only use tables and columns that exist in the provided schema.
// - NEVER invent (hallucinate) table names or column names.

// JSON RESPONSE SCHEMA:
// Your output MUST match this shape:

// {
//   "components": ["string"],
//   "query": "string | null",
//   "description": "string"
// }

// - "components": an array deciding what the app should do.
// - "query": the SQL query to execute, or null if no query is needed.
// - "description": a clear human-readable explanation of what you are doing or explaining.

// LOGIC FOR "components":
// 1. If the user asks for data that requires running a SQL query
//    (e.g. "Show me...", "List all...", "How many...", "Top 10...", etc.):
//    - Set "components" to ["query", "description", "data"]
//    - "query" must be a valid, executable SELECT query only.
//    - "description" must explain what the query does in simple terms.

// 2. If the user asks for explanation / documentation / clarification
//    (e.g. "Explain the users table", "How are orders related to customers?"):
//    - Set "components" to ["description"]
//    - "query" must be null.
//    - "description" should contain the full explanation.

// 3. If the user's request is ambiguous or cannot be answered from the schema:
//    - Set "components" to ["description"]
//    - "query" must be null.
//    - "description" should ask a clarifying question.

// STRICT SQL RULES:
// - You are ONLY allowed to generate SELECT statements.
// - NEVER generate INSERT, UPDATE, DELETE, REPLACE, DROP, ALTER, CREATE, TRUNCATE, RENAME, GRANT, REVOKE, CALL, or any DDL/DML query.
// - If the user explicitly asks to modify or delete data, respond with:
//   - components: ["description"]
//   - query: null
//   - description: explain that this tool is read-only and cannot modify data.

// ROW LIMIT:
// - Ensure every SELECT query includes a LIMIT clause.
// - If the user does not specify a limit, default to LIMIT 200.
// - This is important to avoid huge result sets.

// SCHEMA CONTEXT:
// - You will receive a schema description of the database.
// - ONLY use tables and columns from that schema.
// `;

// // --------------------
// // 3. HELPERS
// // --------------------

// // Extract JSON from a raw model string response
// function extractJsonFromString(rawString) {
//   if (typeof rawString !== "string") return "";

//   // If model accidentally returns ```json ... ``` fenced
//   const fencedRegex = /```json\s*([\s\S]*?)\s*```/i;
//   const fencedMatch = rawString.match(fencedRegex);
//   if (fencedMatch && fencedMatch[1]) {
//     return fencedMatch[1].trim();
//   }

//   // Fallback: try to slice from first "{" to last "}"
//   const firstBrace = rawString.indexOf("{");
//   const lastBrace = rawString.lastIndexOf("}");
//   if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
//     return rawString.slice(firstBrace, lastBrace + 1).trim();
//   }

//   // Last fallback: return as-is
//   return rawString.trim();
// }

// // Simple SQL safety check: only allow SELECT and block dangerous words
// function isSafeSelectQuery(query) {
//   if (typeof query !== "string") return false;

//   const trimmed = query.trim().toLowerCase();

//   // Must start with SELECT
//   if (!trimmed.startsWith("select")) return false;

//   // Block common destructive or modifying statements
//   const forbidden =
//     /\b(insert|update|delete|drop|alter|truncate|replace|create|rename|grant|revoke|call|shutdown)\b/i;
//   if (forbidden.test(query)) return false;

//   return true;
// }

// // Ensure there is a LIMIT in the query; if not, append a default
// function ensureLimit(query, defaultLimit = 200) {
//   if (!query) return query;
//   const lower = query.toLowerCase();
//   if (lower.includes(" limit ")) {
//     return query;
//   }
//   // naive but works for most SELECT queries
//   return `${query.trim()} LIMIT ${defaultLimit};`;
// }

// // Gemini API helper
// const geminiApi = async (systemInstructions, schemaContext, userQuestion) => {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash",
//     systemInstruction: systemInstructions,
//   });

//   const fullUserPrompt = `
// You are given the following MySQL database schema:

// ${schemaContext}

// Now answer this user request using ONLY this schema:

// "${userQuestion}"

// Remember:
// - Output ONLY a JSON object (no backticks, no markdown).
// - Follow the JSON schema exactly.
// `;

//   try {
//     const result = await model.generateContent(fullUserPrompt);
//     // Safer: let the SDK assemble the full text
//     const text = result.response.text();
//     return text;
//   } catch (error) {
//     console.error("Error during Gemini API call:", error);
//     // Return a valid JSON string as fallback
//     return JSON.stringify({
//       components: ["description"],
//       query: null,
//       description: "There was an error communicating with the AI service.",
//     });
//   }
// };

// // --------------------
// // 4. ROUTES
// // --------------------

// // Health check
// app.get("/", (req, res) => {
//   res.send("Server is running and responding!");
// });

// // Connect to DB and create pool
// app.post("/api/connect", async (req, res) => {
//   const { host, port, dbName, dbUsername, dbPassword } = req.body;

//   if (!host || !dbName || !dbUsername) {
//     return res.status(400).json({
//       success: false,
//       message:
//         "Missing required database credentials (host, dbName, dbUsername).",
//     });
//   }

//   try {
//     // If an old pool exists, close it
//     if (pool) {
//       await pool.end();
//       pool = null;
//       cachedSchemaText = null;
//       console.log("Previous connection pool closed.");
//     }

//     const newPool = mysql.createPool({
//       host,
//       port,
//       user: dbUsername,
//       password: dbPassword,
//       database: dbName,
//       connectionLimit: 10,
//       waitForConnections: true,
//     });

//     // Test connection
//     const connection = await newPool.getConnection();
//     console.log("✅ Database connection test successful");
//     connection.release();

//     pool = newPool;
//     connectedDbName = dbName;
//     cachedSchemaText = null; // reset cache when DB changes

//     console.log(`✅ Successfully connected to database: ${dbName}`);

//     return res.status(200).json({
//       success: true,
//       message: "Database connected successfully.",
//     });
//   } catch (error) {
//     console.error("❌ Database connection failed:", error.message);
//     return res.status(400).json({
//       success: false,
//       message: "Connection failed. Please check your credentials.",
//     });
//   }
// });

// // Main endpoint: schema + AI + query execution
// app.post("/api/schema", async (req, res) => {
//   if (!pool || !connectedDbName) {
//     return res.status(400).json({
//       success: false,
//       message:
//         "Database is not connected. Please connect to the database via the connection form.",
//     });
//   }

//   const { prompt } = req.body;
//   if (!prompt) {
//     return res.status(400).json({
//       success: false,
//       message: "A 'prompt' is required.",
//     });
//   }

//   try {
//     // 1. Build or reuse schema text
//     let schemaText = cachedSchemaText;

//     if (!schemaText) {
//       const [tables] = await pool.query(
//         `SELECT TABLE_NAME
//          FROM INFORMATION_SCHEMA.TABLES
//          WHERE TABLE_SCHEMA = ?`,
//         [connectedDbName]
//       );

//       if (tables.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "No tables found in the connected database.",
//         });
//       }

//       let schemaParts = [];

//       for (const table of tables) {
//         const tableName = table.TABLE_NAME;

//         const [columns] = await pool.query(
//           `
//           SELECT
//             c.COLUMN_NAME,
//             c.COLUMN_TYPE,
//             c.IS_NULLABLE,
//             c.COLUMN_KEY,
//             c.COLUMN_DEFAULT,
//             c.EXTRA,
//             kcu.REFERENCED_TABLE_NAME AS referenced_table,
//             kcu.REFERENCED_COLUMN_NAME AS referenced_column
//           FROM INFORMATION_SCHEMA.COLUMNS c
//           LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
//             ON c.TABLE_SCHEMA = kcu.TABLE_SCHEMA
//             AND c.TABLE_NAME = kcu.TABLE_NAME
//             AND c.COLUMN_NAME = kcu.COLUMN_NAME
//             AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
//           WHERE c.TABLE_SCHEMA = ?
//             AND c.TABLE_NAME = ?
//           `,
//           [connectedDbName, tableName]
//         );

//         const columnDescriptions = columns.map((col) => {
//           let line = `${col.COLUMN_NAME} ${col.COLUMN_TYPE}`;
//           if (col.IS_NULLABLE === "NO") line += " NOT NULL";
//           if (col.COLUMN_KEY) line += ` ${col.COLUMN_KEY}`;
//           if (col.referenced_table) {
//             line += ` REFERENCES ${col.referenced_table}(${col.referenced_column})`;
//           }
//           if (col.EXTRA) line += ` ${col.EXTRA}`;
//           if (col.COLUMN_DEFAULT !== null) {
//             line += ` DEFAULT ${col.COLUMN_DEFAULT}`;
//           }
//           return line;
//         });

//         const tableText =
//           `Table: ${tableName}\n` + columnDescriptions.join("\n");
//         schemaParts.push(tableText);
//       }

//       schemaText = schemaParts.join("\n\n");
//       cachedSchemaText = schemaText; // cache for future prompts
//     }

//     // 2. Call Gemini to get structured JSON
//     const rawAiResponse = await geminiApi(systemPrompt, schemaText, prompt);

//     // 3. Try to parse the JSON
//     let structuredResponse;
//     try {
//       const cleanedString = extractJsonFromString(rawAiResponse);
//       structuredResponse = JSON.parse(cleanedString);
//     } catch (e) {
//       console.error(
//         "Failed to parse AI JSON response. Raw response was:",
//         rawAiResponse
//       );
//       structuredResponse = {
//         components: ["description"],
//         query: null,
//         description:
//           "Sorry, I encountered an issue generating a valid response. Please try rephrasing your question.",
//       };
//     }

//     // 4. If there's a query, check if it's safe & execute it
//     let queryResult = null;

//     if (structuredResponse.query) {
//       const originalQuery = structuredResponse.query;

//       if (!isSafeSelectQuery(originalQuery)) {
//         console.warn("🚨 Blocked unsafe query from AI:", originalQuery);
//         queryResult = {
//           error:
//             "The generated query was blocked for safety. Only read-only SELECT queries are allowed.",
//         };
//       } else {
//         const safeQuery = ensureLimit(originalQuery);

//         try {
//           const [rows] = await pool.query(safeQuery);
//           queryResult = rows;
//         } catch (queryError) {
//           console.error("Error executing AI query:", queryError.message);
//           queryResult = {
//             error: "Failed to execute AI-generated query.",
//             details: queryError.message,
//           };
//         }
//       }
//     }

//     // 5. Attach result (if any) and respond
//     const responsePayload = {
//       success: true,
//       ...structuredResponse,
//       queryResult,
//     };

//     console.log("✅ Structured response sent to client:", responsePayload);

//     return res.json(responsePayload);
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error.",
//     });
//   }
// });

// // --------------------
// // 5. START SERVER
// // --------------------

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
