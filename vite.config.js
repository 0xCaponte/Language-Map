import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  
  // Test configuration
  test: {
	name: 'Language-map Tests',
	environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,ts}', 'src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    setupFiles: ['./tests/setup.js'],
    deps: {
      inline: [/svelte/]  // Important for Svelte component testing
    }
  },
  
  // Server configuration
  server: {
    port: 3000
  },
  
  // Path resolution
  resolve: {
    alias: {
      // These should already be handled by SvelteKit, but explicitly defining
      // them helps Vitest during testing
      '$lib': path.resolve('./src/lib'),
      // For tests, we need to mock $app imports
      ...(process.env.VITEST ? {
        '$app': path.resolve('./tests/mocks/app')
      } : {}
      )
    }
  }
});