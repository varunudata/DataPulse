export function isSafeSelectQuery(query) {
  const q = query.trim().toLowerCase();

  if (!q.startsWith("select")) return false;

  const forbidden =
    /\b(insert|update|delete|drop|alter|truncate|replace|create|rename|call)\b/i;

  return !forbidden.test(query);
}

export function ensureLimit(query, limit = 200) {
  return query.toLowerCase().includes("limit")
    ? query
    : `${query.trim()} LIMIT ${limit}`;
}
