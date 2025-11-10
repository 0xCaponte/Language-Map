import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { toCountrySlug } from '$lib/helpers/CountrySlugHelper';

type StaticCountryEntry = [string, { commonName?: string }];

class CountrySlugService {
	private static slugToNameMap: Map<string, string> | null = null;
	private static slugList: string[] | null = null;
	private static loadingPromise: Promise<void> | null = null;

	public static clearCache(): void {
		this.slugToNameMap = null;
		this.slugList = null;
		this.loadingPromise = null;
	}

	public static async getAllCountrySlugs(): Promise<string[]> {
		await this.ensureLoaded();
		return this.slugList ?? [];
	}

	public static async getCountryNameBySlug(slug: string): Promise<string | null> {
		if (!slug) {
			return null;
		}

		await this.ensureLoaded();
		return this.slugToNameMap?.get(slug) ?? null;
	}

	private static async ensureLoaded(): Promise<void> {
		if (this.slugToNameMap && this.slugList) {
			return;
		}

		if (!this.loadingPromise) {
			this.loadingPromise = this.loadCountryEntries();
		}

		await this.loadingPromise;
	}

	private static async loadCountryEntries(): Promise<void> {
		try {
			const filePath = path.join(process.cwd(), 'static', 'data', 'countryMap.json');
			const rawFile = await readFile(filePath, 'utf-8');
			const entries: StaticCountryEntry[] = JSON.parse(rawFile);

			const slugToName = new Map<string, string>();

			for (const [, country] of entries) {
				if (!country?.commonName) {
					continue;
				}

				const slug = toCountrySlug(country.commonName);
				if (slug) {
					slugToName.set(slug, country.commonName);
				}
			}

			this.slugToNameMap = slugToName;
			this.slugList = Array.from(slugToName.keys());
		} catch (error) {
			console.error('Failed to load country map data for slug generation', error);
			this.slugToNameMap = new Map();
			this.slugList = [];
		} finally {
			this.loadingPromise = null;
		}
	}
}

export default CountrySlugService;
