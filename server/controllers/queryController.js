import { getPool, loadSchema } from "../services/schemaService.js";
import { callGemini } from "../services/geminiService.js";
import { extractJsonFromString } from "../utils/extractJson.js";
import { systemPrompt } from "../utils/systemPrompt.js";
import { isSafeSelectQuery, ensureLimit } from "../utils/sqlSafety.js";

export const queryController = async (req, res) => {
  try {
    const { prompt } = req.body;
    const schema = await loadSchema();
    const aiText = await callGemini(systemPrompt, schema, prompt);

    const cleaned = extractJsonFromString(aiText);
    console.log("🔍 RAW GEMINI RESPONSE:", aiText);
    console.log("🔍 CLEANED JSON STRING:", cleaned);
    if (!cleaned || cleaned.trim() === "") {
      throw new Error("Gemini returned empty response");
    }
    let json;
    try {
      json = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error:", err);
      throw new Error("AI response was not valid JSON");
    }

    let result = null;
    if (json.query && isSafeSelectQuery(json.query)) {
      const safeQuery = ensureLimit(json.query);
      const [rows] = await getPool().query(safeQuery);
      result = rows;
    }
    res.json({ success: true, ...json, queryResult: result });
  } catch (error) {
    console.log("Error in query controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in query controller",
    });
  }
};
