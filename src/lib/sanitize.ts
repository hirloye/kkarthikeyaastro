/**
 * Sanitizes input strings by escaping HTML special characters
 * to prevent HTML/script injection in email templates and web views.
 */
export function escapeHtml(input: any): string {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
