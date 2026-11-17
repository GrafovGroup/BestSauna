// Fixed labels only. Never add customer values, query strings or enquiry references here.
export const measurementEvents = ["quote_view", "quote_start", "quote_review", "validation_client", "validation_server", "quote_error"] as const;
export const measurementFields = ["name", "email", "phone", "location", "intendedUse", "placement", "interest", "service", "timeframe", "contactMethod", "capacity", "heat", "budget", "message", "commercialFacility", "commercialStage", "commercialUsage", "commercialHours", "commercialEquipment", "commercialProcurement", "commercialDetails", "privacyAccepted", "form"] as const;
export const measurementErrors = ["network", "rate_limit", "conflict", "unavailable"] as const;
export const MEASUREMENT_TTL = 30 * 60 * 1000;
export type MeasurementEvent = typeof measurementEvents[number];
export type MeasurementContext = { entryPath: string; language: "en" | "fr"; device: "small" | "medium" | "large" };
export function validEvent(event: unknown, detail: unknown): event is MeasurementEvent {
  if (!measurementEvents.includes(event as MeasurementEvent) || typeof detail !== "string") return false;
  if (event === "validation_client" || event === "validation_server") return (measurementFields as readonly string[]).includes(detail);
  if (event === "quote_error") return (measurementErrors as readonly string[]).includes(detail);
  return detail === "";
}
