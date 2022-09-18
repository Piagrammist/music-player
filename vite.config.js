import   autoprefixer   from 'autoprefixer'
import sveltePreprocess from 'svelte-preprocess'
import { defineConfig } from 'vite'
import {    svelte    } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        postcss: {
          plugins: [
            autoprefixer(),
          ],
        },
      }),
    }),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ],
    },
  },
  server: {
    'host': 'localhost',
    'port': 5500,
  },
})
