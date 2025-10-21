import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '$lib/../routes/api/world/+server';

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('API /api/world', () => {
        beforeEach(() => {
                fetchMock.mockReset();
        });

        afterEach(() => {
                fetchMock.mockReset();
        });

        describe('GET', () => {
                it('should return TopoJSON data', async () => {
                        const mockTopoJSON = { type: 'Topology', objects: {} };
                        fetchMock.mockResolvedValue({
                                ok: true,
                                json: () => Promise.resolve(mockTopoJSON)
                        });

                        const request = new Request('http://localhost/api/world');
                        const event = { request };
                        const res = await GET(event);
                        const data = await res.json();

                        expect(res.status).toBe(200);
                        expect(data).toEqual(mockTopoJSON);
                        expect(fetchMock).toHaveBeenCalledWith('https://r2.languagemap.world/resources/countries-110m.json');
                });

                it('should return 500 on fetch error', async () => {
                        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
                        fetchMock.mockResolvedValue({ ok: false });

                        const request = new Request('http://localhost/api/world');
                        const event = { request };
                        const res = await GET(event);

                        expect(res.status).toBe(500);
                        expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
                        consoleLogSpy.mockRestore();
                });

                it('should return 500 when fetch rejects entirely', async () => {
                        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
                        fetchMock.mockRejectedValue(new Error('network down'));

                        const request = new Request('http://localhost/api/world');
                        const event = { request };
                        const res = await GET(event);

                        expect(res.status).toBe(500);
                        expect(await res.json()).toEqual({ error: 'Error reading the TopoJSON file.' });
                        expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
                        consoleLogSpy.mockRestore();
                });
        });
});