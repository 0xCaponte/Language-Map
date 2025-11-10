import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import CountrySlugService from '$lib/server/helpers/CountrySlugService';
import { normalizeCountrySlug } from '$lib/helpers/CountrySlugHelper';

export const prerender = true;

export async function entries() {
	const countrySlugs = await CountrySlugService.getAllCountrySlugs();
	return countrySlugs.map((country) => ({ country }));
}

export const load: ServerLoad = async ({ params }) => {
	const normalizedSlug = normalizeCountrySlug(params.country);

	if (!normalizedSlug) {
		throw redirect(307, '/');
	}

	const countryName = await CountrySlugService.getCountryNameBySlug(normalizedSlug);

	if (!countryName) {
		throw redirect(307, '/');
	}

	return {
		countryName,
		countrySlug: normalizedSlug
	};
};
