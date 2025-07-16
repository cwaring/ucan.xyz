// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightLLMsTxt from 'starlight-llms-txt';
import robotsTxt from 'astro-robots-txt';
import sidebarConfig from './sidebar-config.json';

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
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/ucan-wg' }
			],
			sidebar: sidebarConfig.sidebar,
			plugins: [
				starlightLLMsTxt()
			],
		}),
	],
});
