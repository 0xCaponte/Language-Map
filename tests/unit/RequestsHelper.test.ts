import { describe, it, expect, vi } from 'vitest';
import { RequestHelper } from '$lib/helpers/RequestsHelper';
import Language from '$lib/model/language';

// Mock fetch
global.fetch = vi.fn();

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(() => 'test-session-id'),
};
vi.stubGlobal('sessionStorage', mockSessionStorage);

describe('RequestHelper', () => {
  describe('fetchLanguageData', () => {
    it('should fetch language data and return an array of Language objects', async () => {
      const mockLanguageData = [
        { name: 'English', statistics: {}, countries: [] },
        { name: 'Spanish', statistics: {}, countries: [] },
      ];
      const response = {
        ok: true,
        json: () => Promise.resolve(mockLanguageData),
      };
      global.fetch.mockResolvedValue(response);

      const helper = new RequestHelper();
      const languages = await helper.fetchLanguageData(['English', 'Spanish']);

      expect(fetch).toHaveBeenCalledWith('/api/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageNames: ['English', 'Spanish'],
          sessionID: 'test-session-id',
        }),
      });

      expect(languages).toHaveLength(2);
      expect(languages[0]).toBeInstanceOf(Language);
      expect(languages[0].name).toBe('English');
    });

    it('should return an empty array if the fetch fails', async () => {
      const response = {
        ok: false,
      };
      global.fetch.mockResolvedValue(response);

      const helper = new RequestHelper();
      const languages = await helper.fetchLanguageData(['English']);

      expect(languages).toEqual([]);
    });

    it('should return an empty array if an error occurs', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const helper = new RequestHelper();
      const languages = await helper.fetchLanguageData(['English']);

      expect(languages).toEqual([]);
    });
  });
});