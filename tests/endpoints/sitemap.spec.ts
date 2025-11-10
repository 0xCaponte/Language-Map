import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '$lib/../routes/sitemap.xml/+server';
import * as sitemap from 'super-sitemap';
import { LanguageDataLoadingHelper } from '$lib/helpers/LanguageDataLoadingHelper';
import CountrySlugService from '$lib/server/helpers/CountrySlugService';

vi.mock('super-sitemap', () => ({
  response: vi.fn()
}));

vi.mock('$lib/server/helpers/CountrySlugService', () => ({
  default: {
    getAllCountrySlugs: vi.fn()
  }
}));

describe('sitemap endpoint', () => {
  const originalLanguages = [...LanguageDataLoadingHelper.DEFAULT_LANGUAGES];

  beforeEach(() => {
    vi.mocked(sitemap.response).mockReset();
    vi.mocked(CountrySlugService.getAllCountrySlugs).mockReset();
    vi.mocked(CountrySlugService.getAllCountrySlugs).mockResolvedValue([]);
    LanguageDataLoadingHelper.DEFAULT_LANGUAGES = [
      { toString: () => 'Esperanto' },
      { toString: () => 'lojban' }
    ] as unknown as string[];
  });

  afterEach(() => {
    LanguageDataLoadingHelper.DEFAULT_LANGUAGES = [...originalLanguages];
  });

  it('passes helper derived language and country routes into the sitemap config', async () => {
    const mockResponse = Symbol('sitemap-response');
    vi.mocked(sitemap.response).mockResolvedValueOnce(mockResponse as any);
    vi.mocked(CountrySlugService.getAllCountrySlugs).mockResolvedValueOnce(['andorra', 'belize']);

    const result = await GET({} as any);

    expect(result).toBe(mockResponse);
    expect(sitemap.response).toHaveBeenCalledTimes(1);

    const sitemapConfig = vi.mocked(sitemap.response).mock.calls[0][0];

    expect(sitemapConfig.origin).toBe('https://www.languagemap.world');
    expect(sitemapConfig.additionalPaths).toEqual(['/about']);
    expect(sitemapConfig.defaultChangefreq).toBe('monthly');
    expect(sitemapConfig.defaultPriority).toBe(0.7);
    expect(sitemapConfig.paramValues['/[language]']).toEqual(['Esperanto', 'lojban']);
    expect(sitemapConfig.paramValues['/country/[country]']).toEqual(['andorra', 'belize']);
  });

  it('surfaces sitemap generation failures', async () => {
    const error = new Error('boom');
    vi.mocked(sitemap.response).mockRejectedValueOnce(error);

    await expect(GET({} as any)).rejects.toThrow(error);
  });
});
