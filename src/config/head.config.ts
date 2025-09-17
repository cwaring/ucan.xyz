import type { SiteConfig } from './site.config.js';

/**
 * Configuration for head meta tags
 */
export interface HeadConfig {
  tag: 'link' | 'meta';
  attrs: Record<string, string | boolean | undefined>;
}

/**
 * Options for head content generation
 */
export interface HeadContentOptions {
  title?: string;
  description?: string;
  imageURL?: string;
}

/**
 * Creates a meta tag configuration
 */
function createMeta(name: string, content: string): HeadConfig {
  return {
    tag: 'meta',
    attrs: { name, content }
  };
}

/**
 * Creates an OpenGraph meta tag configuration
 */
function createOgMeta(property: string, content: string): HeadConfig {
  return {
    tag: 'meta',
    attrs: { property, content }
  };
}

/**
 * Creates a link tag configuration
 */
function createLink(rel: string, href: string, attrs: Record<string, string> = {}): HeadConfig {
  return {
    tag: 'link',
    attrs: { rel, href, ...attrs }
  };
}

/**
 * Enhanced meta tags and links shared by all pages
 */
function getEnhancedMeta(): HeadConfig[] {
  return [
    // Favicons
    createLink('icon', '/favicon.svg', { type: 'image/svg+xml' }),
    createLink('icon', '/favicon-32x32.png', { type: 'image/png', sizes: '32x32' }),
    createLink('icon', '/favicon-16x16.png', { type: 'image/png', sizes: '16x16' }),
    createLink('apple-touch-icon', '/apple-touch-icon.png', { sizes: '180x180' }),
    createLink('manifest', '/site.webmanifest'),
    
    // Theme
    createMeta('theme-color', '#ffffff')
  ];
}

/**
 * Environment-specific meta tags
 */
function getEnvironmentMeta(isProduction: boolean): HeadConfig[] {
  const robotsContent = isProduction 
    ? 'index, follow' 
    : 'noindex, nofollow, noimageindex, nosnippet, noarchive';
    
  return [createMeta('robots', robotsContent)];
}

/**
 * Meta tags for custom pages
 */
function getCustomPageMeta(options: HeadContentOptions, config: SiteConfig): HeadConfig[] {
  const {
    title = config.title,
    description = config.description,
    imageURL = config.defaultImage
  } = options;

  const fullImageURL = `${config.siteURL}${imageURL}`;

  return [
    // Basic meta
    { tag: 'meta', attrs: { charset: 'UTF-8' } },
    createMeta('description', description),
    createMeta('viewport', 'width=device-width, initial-scale=1.0'),
    createMeta('generator', 'Astro'),

    // OpenGraph
    createOgMeta('og:title', title),
    createOgMeta('og:description', description),
    createOgMeta('og:image', fullImageURL),
    createOgMeta('og:url', config.siteURL),
    createOgMeta('og:type', 'website'),

    // Twitter Card
    createMeta('twitter:card', 'summary_large_image'),
    createMeta('twitter:title', title),
    createMeta('twitter:description', description),
    createMeta('twitter:image', fullImageURL),

    // Canonical link
    ...(config.siteURL ? [createLink('canonical', config.siteURL)] : [])
  ];
}

/**
 * Head configuration for Starlight (excludes tags Starlight provides)
 */
export function getStarlightHeadConfig(config: SiteConfig): HeadConfig[] {
  return [
    ...getEnhancedMeta(),
    ...getEnvironmentMeta(config.isProduction)
  ];
}

/**
 * Complete head configuration for custom pages
 */
export function getBaseHeadConfig(config: SiteConfig, options: HeadContentOptions = {}): HeadConfig[] {
  return [
    ...getCustomPageMeta(options, config),
    ...getEnhancedMeta(),
    ...getEnvironmentMeta(config.isProduction)
  ];
}
