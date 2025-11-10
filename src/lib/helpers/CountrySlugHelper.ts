/**
 * @fileoverview Shared helpers to convert country names into URL-safe slugs.
 */

function removeDiacritics(value: string): string {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Converts a display country name into a normalized slug:
 * - Trims whitespace
 * - Removes diacritics and special characters (except internal hyphens)
 * - Collapses whitespace into single dashes
 * - Lowercases the result
 */
export function toCountrySlug(name: string | undefined): string {
	if (!name) {
		return '';
	}

	const cleaned = removeDiacritics(name)
		.replace(/[^a-zA-Z0-9\s-]/g, ' ') // drop punctuation but keep internal hyphens
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.toLowerCase();

	return cleaned;
}

/**
 * Normalizes incoming slug segments to the canonical format used in routing.
 */
export function normalizeCountrySlug(slug: string | undefined): string {
	if (!slug) {
		return '';
	}

	return removeDiacritics(slug)
		.replace(/[^a-zA-Z0-9-]/g, '')
		.replace(/-+/g, '-')
		.trim()
		.toLowerCase();
}
