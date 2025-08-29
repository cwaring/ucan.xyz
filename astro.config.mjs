// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightLLMsTxt from 'starlight-llms-txt';
import robotsTxt from 'astro-robots-txt';
import vue from '@astrojs/vue';
import icon from 'astro-icon';
import sidebarConfig from './sidebar-config.json';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ucan.xyz',

  integrations: [
      robotsTxt({
          policy: [
              {
                  userAgent: '*',
                  disallow: '/',
              }
          ]
      }),
      mermaid({
          theme: 'default',
          autoTheme: true
      }),
      starlight({
          title: 'UCAN',
          customCss: [
            '/src/styles/sl-custom.css'
          ],
          logo: {
              light: '/src/assets/logo.png',
              dark: '/src/assets/logo.png',
          },
          description: 'User-Controlled Authorization Network (UCAN) is a trustless, secure, local-first, user-originated, distributed authorization scheme. This document provides a high-level overview of the UCAN specification and its components.',
          favicon: '/favicon.ico',
          head: [
              // Prevent search engine indexing
              {
                  tag: 'meta',
                  attrs: {
                      name: 'robots',
                      content: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
                  },
              },
              {
                  tag: 'meta',
                  attrs: {
                      name: 'googlebot',
                      content: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
                  },
              },
              // Add favicon fallback for Safari.
              {
                  tag: 'link',
                  attrs: {
                      rel: 'icon',
                      href: '/favicon.ico',
                      sizes: '32x32',
                  },
              },
          ],
          social: [
              { icon: 'github', label: 'GitHub', href: 'https://github.com/ucan-wg' },
              { icon: 'discord', label: 'Discord', href: 'https://discord.gg/zSfgeHhKxA' }
          ],
          sidebar: sidebarConfig.sidebar,
          plugins: [
              starlightLLMsTxt()
          ],
      }),
      vue(),
      icon({
          include: {
              lucide: ['*'],
          },
      }),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});
