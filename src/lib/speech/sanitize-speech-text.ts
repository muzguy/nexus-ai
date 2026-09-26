/**
 * NEXUS Speech Sanitization Utility
 * Cleans user-facing brand explanation text into natural, spoken English
 * suitable for the Web Speech API (window.speechSynthesis).
 */

export function sanitizeSpeechText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // 1. Remove HTML tags if any
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');

  // 2. Remove Markdown links: [anchor text](url) -> anchor text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 3. Remove Markdown image references: ![alt](url) -> empty
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // 4. Remove code blocks ```code``` and inline code `code`
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ' ');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 5. Remove Markdown headings: #, ##, etc. at start of line or space
  cleaned = cleaned.replace(/(^|\n)#{1,6}\s+/g, '$1');

  // 6. Remove Markdown bold/italic: **text**, *text*, __text__, _text_
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1');

  // 7. Remove Markdown list markers (*, -, +, 1.) at line starts
  cleaned = cleaned.replace(/(^|\n)\s*[-*+]\s+/g, '$1 ');
  cleaned = cleaned.replace(/(^|\n)\s*\d+\.\s+/g, '$1 ');

  // 8. Remove blockquotes: > text
  cleaned = cleaned.replace(/(^|\n)\s*>\s+/g, '$1 ');

  // 9. Remove emojis and pictographs
  try {
    cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, '');
  } catch {
    // Fallback regex for environments without unicode property escapes
    cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  }

  // 10. Clean up raw JSON or object-like syntax artifacts if accidentally included
  cleaned = cleaned.replace(/[{}[\]]/g, ' ');
  cleaned = cleaned.replace(/"[a-zA-Z0-9_-]+":/g, ' ');

  // 11. Remove UI labels & internal identifiers that shouldn't be read
  cleaned = cleaned.replace(/Why this\?/gi, '');
  cleaned = cleaned.replace(/\b(Close|Explainability Layer|Grounded in active project context)\b/gi, '');
  cleaned = cleaned.replace(/\b(id|uuid):\s*[a-zA-Z0-9_-]+/gi, '');
  cleaned = cleaned.replace(/\b(cand|dir|vec|stage|proj)[-_][a-zA-Z0-9_-]+\b/gi, '');

  // 12. Convert special typographic symbols to natural spoken pauses
  cleaned = cleaned.replace(/[—–]/g, ', '); // em/en dash to pause
  cleaned = cleaned.replace(/[•·|/]/g, ', '); // bullets/bars to pause
  cleaned = cleaned.replace(/→/g, ' leading to ');
  cleaned = cleaned.replace(/←/g, ' from ');
  cleaned = cleaned.replace(/[✕✓✔✗]/g, ' ');

  // 13. Remove quotes that might sound unnatural when read literally
  cleaned = cleaned.replace(/[“”"']/g, '');

  // 14. Normalize punctuation & whitespace
  cleaned = cleaned.replace(/\s*,\s*,+/g, ','); // multiple commas
  cleaned = cleaned.replace(/\s*\.\s*\.+/g, '.'); // multiple periods
  cleaned = cleaned.replace(/,\s*\./g, '.'); // comma followed by period
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 15. Ensure sentence ends cleanly
  if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  return cleaned;
}
