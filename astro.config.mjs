// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sidebarConfig from './sidebar-config.json';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'UCAN Specification',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/ucan-wg/spec' }
			],
			sidebar: sidebarConfig.sidebar,
		}),
	],
});
