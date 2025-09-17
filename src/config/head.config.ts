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
 * Returns null if content is empty to avoid creating invalid tags
 */
function createMeta(name: string, content: string): HeadConfig | null {
  if (!content || content.trim() === '') {
    return null;
  }
  
  return {
    tag: 'meta',
    attrs: { name, content }
  };
}

/**
 * Creates an OpenGraph meta tag configuration
 * Returns null if content is empty to avoid creating invalid tags
 */
function createOgMeta(property: string, content: string): HeadConfig | null {
  if (!content || content.trim() === '') {
    return null;
  }
  
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
  const metaTags: (HeadConfig | null)[] = [
    // Favicons
    createLink('icon', '/favicon.svg', { type: 'image/svg+xml' }),
    createLink('icon', '/favicon-32x32.png', { type: 'image/png', sizes: '32x32' }),
    createLink('icon', '/favicon-16x16.png', { type: 'image/png', sizes: '16x16' }),
    createLink('apple-touch-icon', '/apple-touch-icon.png', { sizes: '180x180' }),
    createLink('manifest', '/site.webmanifest'),
    
    // Theme
    createMeta('theme-color', '#ffffff')
  ];
  
  // Filter out null values
  return metaTags.filter((tag): tag is HeadConfig => tag !== null);
}

/**
 * Environment-specific meta tags
 */
function getEnvironmentMeta(isProduction: boolean): HeadConfig[] {
  const robotsContent = isProduction 
    ? 'index, follow' 
    : 'noindex, nofollow, noimageindex, nosnippet, noarchive';
    
  const metaTags: (HeadConfig | null)[] = [createMeta('robots', robotsContent)];
  
  // Filter out null values
  return metaTags.filter((tag): tag is HeadConfig => tag !== null);
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

  const metaTags: (HeadConfig | null)[] = [
    // Basic meta
    { tag: 'meta', attrs: { charset: 'UTF-8' } },
    createMeta('description', description),
    createMeta('viewport', 'width=device-width, initial-scale=1.0'),
    createMeta('generator', 'Astro'),

    // OpenGraph
    createOgMeta('og:title', title),
    createOgMeta('og:description', description),
    createOgMeta('og:image', fullImageURL),
    ...(config.siteURL ? [createOgMeta('og:url', config.siteURL)] : []),
    createOgMeta('og:type', 'website'),

    // Twitter Card
    createMeta('twitter:card', 'summary_large_image'),
    createMeta('twitter:title', title),
    createMeta('twitter:description', description),
    createMeta('twitter:image', fullImageURL),

    // Canonical link
    ...(config.siteURL ? [createLink('canonical', config.siteURL)] : [])
  ];

  // Filter out null values
  return metaTags.filter((tag): tag is HeadConfig => tag !== null);
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
