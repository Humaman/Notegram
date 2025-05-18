export function escapeHTML(str: string = ''): string {
  return String(str).replace(/["&<>]/g, (s) => {
    const escape: Record<string, string> = {
      '"': '&quot;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    };
    return escape[s] || s;
  });
}
