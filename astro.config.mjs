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
import { getStarlightHeadConfig } from './src/config/head.config.js';
import { siteConfig } from './src/config/site.config.js';

// https://astro.build/config
export default defineConfig({
  // Only set site if we have a valid URL (not empty string)
  ...(siteConfig.siteURL && { site: siteConfig.siteURL }),

  integrations: [
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          disallow: siteConfig.isProduction ? '' : '/',
        }
      ]
    }),
    mermaid({
      theme: 'default',
      autoTheme: true
    }),
    starlight({
      title: siteConfig.title,
      customCss: [
        '/src/styles/sl-custom.css'
      ],
      logo: {
        light: '/src/assets/logo.png',
        dark: '/src/assets/logo.png',
      },
      description: siteConfig.description,
      favicon: '/favicon.svg',
      head: [
        // Use Starlight-specific head configuration that includes base tags without conflicts
        ...getStarlightHeadConfig(siteConfig),
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/ucan-wg' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/zSfgeHhKxA' }
      ],
      sidebar: sidebarConfig.sidebar,
      plugins: [
        // Depends on siteURL being set
        ...(siteConfig.siteURL ? [starlightLLMsTxt()] : [])
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
