import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind(), svelte()],
  output: 'server',
  adapter: vercel()
});