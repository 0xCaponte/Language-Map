import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.fn();
global.fetch = fetchMock;

const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

vi.mock('$env/static/private', () => ({
        BASE_URL: 'http://localhost:5173'
}));

const mockLanguageMap = new Map([
        ['english', { name: 'English', countries: [{ countryId: '840' }] }],
        ['spanish', { name: 'Spanish', countries: [{ countryId: '724' }] }],
        ['french', { name: 'French', countries: [{ countryId: '250' }] }]
]);

const loadLanguagesRoute = () => import('$lib/../routes/api/languages/+server');

describe('API /api/languages', () => {
        beforeEach(() => {
                fetchMock.mockReset();
                consoleLogSpy.mockClear();
                vi.unstubAllEnvs();
                vi.resetModules();
        });

        afterEach(() => {
                fetchMock.mockReset();
                vi.unstubAllEnvs();
                vi.resetModules();
        });

        afterAll(() => {
                vi.unstubAllEnvs();
        });

        describe('GET', () => {
                it('should return a list of language keys and fetch using the request origin by default', async () => {
                        vi.stubEnv('DEV', '');
                        const { GET } = await loadLanguagesRoute();
                        fetchMock.mockResolvedValue({
                                ok: true,
                                json: () => Promise.resolve(Array.from(mockLanguageMap.entries()))
                        });

                        const request = new Request('https://example.com/api/languages');
                        const event = { request, url: new URL(request.url) };
                        const res = await GET(event);
                        const data = await res.json();

                        expect(res.status).toBe(200);
                        expect(data).toEqual(['english', 'spanish', 'french']);
                        expect(fetchMock).toHaveBeenCalledWith('https://example.com/data/languageMap.json');
                });

                it('should use BASE_URL when running in dev mode', async () => {
                        vi.stubEnv('DEV', 'true');
                        const { GET } = await loadLanguagesRoute();
                        fetchMock.mockResolvedValue({
                                ok: true,
                                json: () => Promise.resolve(Array.from(mockLanguageMap.entries()))
                        });

                        const request = new Request('https://production.example/api/languages');
                        const event = { request, url: new URL(request.url) };
                        await GET(event);

                        expect(fetchMock).toHaveBeenCalledWith('http://localhost:5173/data/languageMap.json');
                });

                it('should return 500 on fetch error', async () => {
                        vi.stubEnv('DEV', '');
                        const { GET } = await loadLanguagesRoute();
                        fetchMock.mockResolvedValue({ ok: false });

                        const request = new Request('http://localhost/api/languages');
                        const event = { request, url: new URL(request.url) };
                        const res = await GET(event);

                        expect(res.status).toBe(500);
                });
        });

        describe('POST', () => {
                it('should return language data for the given names and log analytics', async () => {
                        vi.stubEnv('DEV', '');
                        const { POST } = await loadLanguagesRoute();
                        fetchMock.mockResolvedValue({
                                ok: true,
                                json: () => Promise.resolve(Array.from(mockLanguageMap.entries()))
                        });

                        const request = new Request('http://localhost/api/languages', {
                                method: 'POST',
                                body: JSON.stringify({
                                        languageNames: ['English', 'SPANISH', 'english', 'Invalid'],
                                        sessionID: 'session-123'
                                })
                        });
                        const event = { request, url: new URL(request.url) };
                        const res = await POST(event);
                        const data = await res.json();

                        expect(res.status).toBe(200);
                        expect(data).toHaveLength(2);
                        expect(data.map((entry: any) => entry.name)).toEqual(['English', 'Spanish']);

                        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
                        const logPayload = JSON.parse(consoleLogSpy.mock.calls[0][0]);
                        expect(logPayload.numberOfOriginalLanguages).toBe(4);
                        expect(logPayload.numberOfValidLanguages).toBe(2);
                        expect(logPayload.validLanguages).toEqual(['english', 'spanish']);
                        expect(logPayload.sessionID).toBe('session-123');
                });

                it('should propagate errors when the language map fails to load', async () => {
                        vi.stubEnv('DEV', '');
                        const { POST } = await loadLanguagesRoute();
                        fetchMock.mockResolvedValue({ ok: false });

                        const request = new Request('http://localhost/api/languages', {
                                method: 'POST',
                                body: JSON.stringify({ languageNames: ['english'] })
                        });
                        const event = { request, url: new URL(request.url) };

                        await expect(POST(event)).rejects.toThrow('Failed to load language map data');
                });
        });
});