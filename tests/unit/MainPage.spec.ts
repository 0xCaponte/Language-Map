/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import MainPage from '../../src/routes/+page.svelte';
import { selectedLanguages } from '$lib/store';
import { tick } from 'svelte';
import Language from '$lib/model/language';

// Mock fetch
global.fetch = vi.fn();

const mockLanguageMap = new Map([
  ['english', { name: 'English', countries: [ { countryId: '840' }] }],
  ['spanish', { name: 'Spanish', countries: [] }],
]);

vi.mock('$app/environment', () => ({
    browser: true
}));

describe('/[language] endpoint', () => {
    it('should update the selectedLanguages store with the language from the URL', async () => {
      const response = {
        ok: true,
        json: () => Promise.resolve(Array.from(mockLanguageMap.keys())),
      };
      const languageResponse = {
        ok: true,
        json: () => Promise.resolve([new Language('English', {}, [{ countryId: '840' }])]),
      };
      global.fetch.mockResolvedValueOnce(response).mockResolvedValueOnce(languageResponse);

      let languages;
      selectedLanguages.subscribe(value => {
        languages = value;
      });

      render(MainPage, { props: { defaultLanguage: 'english' } });

      await tick();
      await tick();

      expect(languages).toHaveLength(1);
      expect(languages[0].name).toBe('English');
    });
});