import { describe, it, expect, vi } from 'vitest';
import { load as serverLoad } from '../../src/routes/[language]/+page.server';
import { load as pageLoad } from '../../src/routes/[language]/+page';
import { redirect } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
  redirect: vi.fn(),
}));

describe('Language Page Loaders', () => {
  describe('serverLoad', () => {
    it('should return the language name for a valid language', async () => {
      const params = { language: 'english' };
      const result = await serverLoad({ params });
      expect(result).toEqual({ languageName: 'english' });
    });

    it('should throw a redirect for an invalid language', async () => {
      const params = { language: 'invalid-language' };
      // The `redirect` function works by throwing an error, so we expect this to throw.
      try {
        await serverLoad({ params });
      } catch {
        // Expected to throw
      }
      expect(redirect).toHaveBeenCalledWith(307, '/');
    });
  });

  describe('pageLoad', () => {
    it('should return the language name from params', () => {
      const params = { language: 'spanish' };
      const result = pageLoad({ params });
      expect(result).toEqual({ languageName: 'spanish' });
    });
  });
});
