import adapterAuto from '@sveltejs/adapter-auto';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// Determine the adapter based on an environment variable
const isDeployingToCloudflare = process.env.ADAPTER === 'cloudflare';

const adapter = isDeployingToCloudflare
  ? adapterCloudflare()
  : adapterAuto({
      // Your existing configuration for the auto adapter
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    });

export default {
  kit: {
    adapter: adapter
  },
  preprocess: [vitePreprocess({})]
};
