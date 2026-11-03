import { FwError } from "../domain/errors";
export function parseModelConnection(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string" || value.length < 1 || value.length > 128) throw new FwError("invalid_request");
  return value;
}
