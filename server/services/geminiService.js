import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

export const callGemini = async (systemPrompt, schema, userPrompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });
  const fullUserPrompt = `You are given the following MySQL database Schema : ${schema}
    Now answer this user request using ONLY this schema: User request: ${userPrompt}
    Remember:
      - Output ONLY a JSON object (no backticks, no markdown).
      - Follow the JSON schema exactly.`;
  const result = await model.generateContent(fullUserPrompt);
  return result.response.text();
};
