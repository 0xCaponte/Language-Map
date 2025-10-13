import { describe, it, expect, vi } from 'vitest';
import { GET } from '$lib/../routes/sitemap.xml/+server';
import * as sitemap from 'super-sitemap';

vi.mock('super-sitemap', () => ({
  response: vi.fn(),
}));

describe('Sitemap Endpoint', () => {
  it('should generate a sitemap with the correct routes', async () => {
    await GET({} as any);

    expect(sitemap.response).toHaveBeenCalled();
    const sitemapConfig = (sitemap.response as any).mock.calls[0][0];

    expect(sitemapConfig.origin).toBe('https://www.languagemap.world');
    expect(sitemapConfig.additionalPaths).toContain('/about');
    expect(sitemapConfig.paramValues['/[language]']).toBeDefined();
    expect(sitemapConfig.paramValues['/[language]'].length).toBeGreaterThan(0);
  });
});
