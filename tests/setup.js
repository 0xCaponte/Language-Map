import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Mock SvelteKit modules
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn()
}));

vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn()
  }
}));

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});