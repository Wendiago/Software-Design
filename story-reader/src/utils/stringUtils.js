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
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, match => map[match]);

    const result = normalizedStr.toLowerCase().replace(/\s+/g, '-');
    return result;
}