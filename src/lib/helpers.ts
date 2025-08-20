export function normalizeAttributes(value: unknown): Record<string, string[]> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, string[]>;
  }
  return {};
}
