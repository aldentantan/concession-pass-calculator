const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Formats an ISO date string to "DD MMM YYYY" format
 * @param isoDate - ISO 8601 date string (e.g., "2025-12-18T03:02:00.017Z")
 * @returns Formatted date string (e.g., "18 Dec 2025")
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Formats date to "MMM YYYY" for statement month display
 * @param isoDate - ISO 8601 date string
 * @returns Formatted month string (e.g., "Dec 2025")
 */
export function formatMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}