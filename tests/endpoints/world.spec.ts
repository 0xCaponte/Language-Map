import { describe, it, expect, vi } from 'vitest';
import { GET } from '$lib/../routes/api/world/+server';

// Mock fetch
global.fetch = vi.fn();

describe('API /api/world', () => {
  describe('GET', () => {
    it('should return TopoJSON data', async () => {
      const mockTopoJSON = { type: 'Topology', objects: {} };
      const response = {
        ok: true,
        json: () => Promise.resolve(mockTopoJSON),
      };
      global.fetch.mockResolvedValue(response);

      const request = new Request('http://localhost/api/world');
      const event = { request };
      const res = await GET(event);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockTopoJSON);
      expect(fetch).toHaveBeenCalledWith('https://r2.languagemap.world/resources/countries-110m.json');
    });

    it('should return 500 on fetch error', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      global.fetch.mockResolvedValue({ ok: false });

      const request = new Request('http://localhost/api/world');
      const event = { request };
      const res = await GET(event);

      expect(res.status).toBe(500);
      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });
  });
});