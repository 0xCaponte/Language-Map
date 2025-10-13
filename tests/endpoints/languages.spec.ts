import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '$lib/../routes/api/languages/+server';
import { BASE_URL } from '$env/static/private';

// Mock fetch
global.fetch = vi.fn();

// Mock console.log
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

vi.mock('$env/static/private', () => ({
    BASE_URL: 'http://localhost:5173'
}));

const mockLanguageMap = new Map([
  ['english', { name: 'English', countries: [] }],
  ['spanish', { name: 'Spanish', countries: [] }],
]);

describe('API /api/languages', () => {
  describe('GET', () => {
    it('should return a list of language keys', async () => {
      const response = {
        ok: true,
        json: () => Promise.resolve(Array.from(mockLanguageMap.entries())),
      };
      global.fetch.mockResolvedValue(response);

      const request = new Request('http://localhost/api/languages');
      const event = { request, url: new URL(request.url) };
      const res = await GET(event);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(['english', 'spanish']);
    });

    it('should return 500 on fetch error', async () => {
        global.fetch.mockResolvedValue({ ok: false });

        const request = new Request('http://localhost/api/languages');
        const event = { request, url: new URL(request.url) };
        const res = await GET(event);

        expect(res.status).toBe(500);
      });
  });

  describe('POST', () => {
    it('should return language data for the given names', async () => {
        const response = {
            ok: true,
            json: () => Promise.resolve(Array.from(mockLanguageMap.entries())),
          };
        global.fetch.mockResolvedValue(response);

      const request = new Request('http://localhost/api/languages', {
        method: 'POST',
        body: JSON.stringify({ languageNames: ['English', 'Spanish', 'Invalid'] }),
      });
      const event = { request, url: new URL(request.url) };
      const res = await POST(event);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('English');
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });
});