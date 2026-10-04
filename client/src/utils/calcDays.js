/**
 * Calculates inclusive day count between two date strings.
 * E.g. start="2026-10-04", end="2026-10-05" -> 2 days.
 */
export function calcDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  } catch (e) {
    return 0;
  }
}
