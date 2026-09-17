export const EVENT_TICKET_COLORS = [
  "#3FD246",
  "#7E22CE",
  "#F59E0B",
  "#2563EB",
  "#DC2626",
  "#0D9488",
] as const;

export function getEventTicketColor(index: number): string {
  const safeIndex = Math.max(0, Math.floor(index));
  return EVENT_TICKET_COLORS[safeIndex % EVENT_TICKET_COLORS.length];
}
