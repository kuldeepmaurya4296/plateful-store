/**
 * Strips HTML tags and escapes potentially dangerous characters to prevent XSS.
 */
export function sanitize(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip simple HTML tags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
