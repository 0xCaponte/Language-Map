import adapterAuto from '@sveltejs/adapter-auto';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

// Determine the adapter based on the environment or a custom condition.
// For example, you could use an environment variable to switch between adapters.
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
