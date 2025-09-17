// Shared site configuration
// This file contains the default values used by both Starlight and custom pages

export interface SiteConfig {
  title: string;
  description: string;
  siteURL: string;
  defaultImage: string;
  isProduction: boolean;
}

// Production environment check
export function isProductionEnvironment(): boolean {
  return process.env.DEPLOYMENT_ENVIRONMENT === 'production';
}

// Validate that siteURL is set in production
function getSiteURL(): string {
  const siteURL = process.env.SITE_URL || process.env.URL;
  const isProduction = isProductionEnvironment();
  
  if (isProduction && !siteURL) {
    throw new Error('SITE_URL or URL environment variable must be set in production');
  }
  
  // Return empty string when not set (for development)
  return siteURL || '';
}

export const siteConfig: SiteConfig = {
  title: 'UCAN',
  description: 'User-Controlled Authorization Network (UCAN) is a trustless, secure, local-first, user-originated, distributed authorization scheme. This document provides a high-level overview of the UCAN specification and its components.',
  siteURL: getSiteURL(),
  defaultImage: '/og.png',
  isProduction: isProductionEnvironment(),
};
