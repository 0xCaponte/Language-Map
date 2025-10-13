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
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json'],
      include: ['src/lib/**/*.{js,ts}'],
      exclude: [
        'src/lib/model',
        'src/lib/components',
        'src/lib/server/cache.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/.svelte-kit/**',
        '**/build/**'
      ],
      reportOnFailure: true
    }
  },
  
  // Server configuration
  server: {
    port: 5173
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