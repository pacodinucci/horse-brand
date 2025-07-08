export function normalizeAttributes(value: unknown): Record<string, string[]> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    // Podés agregar lógica extra para validar los valores de los arrays si querés
    return value as Record<string, string[]>;
  }
  return {};
}
