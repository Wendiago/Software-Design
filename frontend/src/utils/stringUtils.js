/**
 * Converts a string to a URL-friendly format by:
 * - Converting to lowercase
 * - Replacing accented characters with their non-accented equivalents
 * - Replacing spaces with hyphens
 * 
 * @param {string} str - The input string to normalize
 * @returns {string} - The normalized string
 */
export function normalizeString(str) {
  const map = {
    'đ': 'd',
    'Đ': 'D'
  };

  const normalizedStr = str
    .normalize('NFD')
    .replace(/[đĐ]/g, match => map[match])
    .replace(/[\u0021-\u002c]/g, '')
    .replace(/[\u002e-\u002f]/g, '')
    .replace(/[\u003a-\u0040]/g, '')
    .replace(/[\u005b-\u0060]/g, '')
    .replace(/[\u007b-\u1eff]/g, '');

  const result = normalizedStr.toLowerCase().replace(/\s+/g, '-');
  return result;
}