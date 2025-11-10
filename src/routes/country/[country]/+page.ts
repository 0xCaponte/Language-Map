import type { Load } from '@sveltejs/kit';
import { normalizeCountrySlug } from '$lib/helpers/CountrySlugHelper';

export const load: Load = ({ params }) => {
	return {
		countrySlug: normalizeCountrySlug(params.country)
	};
};
