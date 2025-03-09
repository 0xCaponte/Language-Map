import adapterAuto from '@sveltejs/adapter-auto';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isDeployingToCloudflare = process.env.ADAPTER === 'cloudflare';

const adapter = isDeployingToCloudflare
  ? adapterCloudflare()
  : adapterAuto({
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    });

export default {
  kit: {
    adapter,
    prerender: {
      entries: ['*'] // This ensures all dynamic routes are prerendered
    }
  },
  hooks: {  // Custom build logging
    buildStart() {
      console.log('SvelteKit build is starting...');
    },
    buildEnd() {
      console.log('SvelteKit build has finished.');
    },
  },
  preprocess: [vitePreprocess({})]
};
