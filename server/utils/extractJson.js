export function extractJsonFromString(raw) {
  if (!raw || typeof raw !== "string") return null;

  // 1. Try to extract fenced JSON block ```json ... ```
  const fencedMatch = raw.match(/```json([\s\S]*?)```/i);
  if (fencedMatch && fencedMatch[1]) {
    return fencedMatch[1].trim();
  }

  // 2. Try to extract ANY code fence ``` ... ```
  const genericFence = raw.match(/```([\s\S]*?)```/);
  if (genericFence && genericFence[1]) {
    return genericFence[1].trim();
  }

  // 3. Fallback: extract first {...} in the text
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return raw.substring(start, end + 1).trim();
  }

  // 4. If no JSON found, return null
  return null;
}
