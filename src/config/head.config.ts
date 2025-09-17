import { siteConfig } from './site.config.js';

/**
 * Ensure we have a proper absolute URL for meta tags
 */
function getAbsoluteURL(siteURL: string): string {
  // Handle empty string (development mode)
  if (!siteURL || siteURL.trim() === '') {
    throw new Error('siteURL is required for generating absolute URLs. Set SITE_URL or URL environment variable.');
  }
  
  // If it's already absolute, return as-is
  if (siteURL.startsWith('http://') || siteURL.startsWith('https://')) {
    return siteURL;
  }
  
  // If it starts with //, add protocol
  if (siteURL.startsWith('//')) {
    return `https:${siteURL}`;
  }
  
  // If it's relative or just a domain, ensure it has https://
  if (!siteURL.startsWith('/')) {
    return `https://${siteURL}`;
  }
  
  // For paths starting with /, we need a base domain - this should not happen in production
  // as siteURL should always be a full URL when properly configured
  throw new Error(`Invalid siteURL configuration: "${siteURL}". Expected absolute URL.`);
}

/**
 * Configuration for head meta tags
 */
export interface HeadConfig {
  tag: 'base' | 'title' | 'link' | 'style' | 'meta' | 'script' | 'noscript' | 'template';
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
}

/**
 * Options for head content generation
 */
export interface HeadContentOptions {
  title?: string;
  description?: string;
  imageURL?: string;
  siteURL?: string;
  isProduction?: boolean;
}

/**
 * Enhanced meta tags and links shared by all pages
 */
function getEnhancedMeta(siteURL: string): HeadConfig[] {
  const absoluteURL = getAbsoluteURL(siteURL);
  
  return [
    // Extended favicons
    {
      tag: 'link',
      attrs: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg'
      }
    },
    {
      tag: 'link',
      attrs: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      }
    },
    {
      tag: 'link',
      attrs: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      }
    },
    {
      tag: 'link',
      attrs: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      }
    },
    {
      tag: 'link',
      attrs: {
        rel: 'manifest',
        href: `${absoluteURL}/site.webmanifest`
      }
    },

    // Theme color
    {
      tag: 'meta',
      attrs: {
        name: 'theme-color',
        content: '#ffffff'
      }
    }
  ];
}

/**
 * Environment-specific meta tags (robots control based on environment)
 */
function getEnvironmentMeta(isProduction: boolean): HeadConfig[] {
  const config: HeadConfig[] = [];
  
  // Explicitly set indexing permissions based on environment
  if (isProduction) {
    config.push({
      tag: 'meta',
      attrs: {
        name: 'robots',
        content: 'index, follow'
      }
    });
  } else {
    config.push({
      tag: 'meta',
      attrs: {
        name: 'robots',
        content: 'noindex, nofollow, noimageindex, nosnippet, noarchive'
      }
    });
  }
  
  return config;
}

/**
 * Meta tags for custom pages (Starlight provides these automatically)
 */
function getCustomPageMeta(options: HeadContentOptions): HeadConfig[] {
  const { 
    title = siteConfig.title,
    description = siteConfig.description,
    imageURL = siteConfig.defaultImage,
    siteURL = siteConfig.siteURL
  } = options;

  const absoluteURL = getAbsoluteURL(siteURL);

  return [
    // Basic meta tags
    {
      tag: 'meta',
      attrs: {
        charset: 'UTF-8'
      }
    },
    {
      tag: 'meta',
      attrs: {
        name: 'description',
        content: description
      }
    },
    {
      tag: 'meta',
      attrs: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }
    },
    {
      tag: 'meta',
      attrs: {
        name: 'generator',
        content: 'Astro'
      }
    },

    // OpenGraph meta tags
    {
      tag: 'meta',
      attrs: {
        property: 'og:title',
        content: title
      }
    },
    {
      tag: 'meta',
      attrs: {
        property: 'og:description',
        content: description
      }
    },
    {
      tag: 'meta',
      attrs: {
        property: 'og:image',
        content: `${absoluteURL}${imageURL}`
      }
    },
    {
      tag: 'meta',
      attrs: {
        property: 'og:url',
        content: absoluteURL
      }
    },
    {
      tag: 'meta',
      attrs: {
        property: 'og:type',
        content: 'website'
      }
    },

    // Twitter Card meta tags
    {
      tag: 'meta',
      attrs: {
        name: 'twitter:card',
        content: 'summary_large_image'
      }
    },
    {
      tag: 'meta',
      attrs: {
        name: 'twitter:title',
        content: title
      }
    },
    {
      tag: 'meta',
      attrs: {
        name: 'twitter:description',
        content: description
      }
    },
    {
      tag: 'meta',
      attrs: {
        name: 'twitter:image',
        content: `${absoluteURL}${imageURL}`
      }
    },

    // Canonical link
    {
      tag: 'link',
      attrs: {
        rel: 'canonical',
        href: absoluteURL
      }
    }
  ];
}

/**
 * Head configuration for Starlight (excludes tags Starlight provides)
 */
export function getStarlightHeadConfig(options: HeadContentOptions = {}): HeadConfig[] {
  const {
    isProduction = siteConfig.isProduction,
    siteURL = siteConfig.siteURL
  } = options;

  return [
    ...getEnhancedMeta(siteURL),
    ...getEnvironmentMeta(isProduction)
  ];
}

/**
 * Complete head configuration for custom pages
 */
export function getBaseHeadConfig(options: HeadContentOptions = {}): HeadConfig[] {
  const {
    isProduction = siteConfig.isProduction,
    siteURL = siteConfig.siteURL
  } = options;

  return [
    ...getCustomPageMeta(options),
    ...getEnhancedMeta(siteURL),
    ...getEnvironmentMeta(isProduction)
  ];
}
