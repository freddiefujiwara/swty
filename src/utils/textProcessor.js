/**
 * Cleans the input text according to the requirements:
 * - Convert to lowercase
 * - Remove all characters except lowercase alphabets and spaces
 *
 * @param {string} text
 * @returns {string}
 */
export function cleanText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z ]/g, '');
}

/**
 * Parses CSV text into an array of cleaned sentences.
 *
 * @param {string} csvText
 * @returns {string[]}
 */
export function parseCSV(csvText) {
  if (!csvText) return [];

  // Split by newline or comma
  // Note: Simple split might not handle quoted CSV correctly,
  // but for "simple English sentences" it's usually enough.
  // We also filter out empty results after cleaning.
  return csvText
    .split(/[\n,]/)
    .map(item => item.trim())
    .map(cleanText)
    .map(text => text.replace(/\s+/g, ' ').trim()) // Also collapse multiple spaces and trim
    .filter(text => text.length > 0);
}
