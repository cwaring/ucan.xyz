/**
 * Shared link processing utilities for UCAN documentation
 * 
 */

import { PROCESSING_CONFIG } from './config.js';

/**
 * Convert a raw GitHub URL to a repository URL
 * @param {string} rawUrl - The raw GitHub URL (e.g., https://raw.githubusercontent.com/owner/repo/branch/file)
 * @returns {string} - The repository URL (e.g., https://github.com/owner/repo)
 */
function convertRawUrlToRepoUrl(rawUrl) {
  // Match pattern: https://raw.githubusercontent.com/owner/repo/branch/path
  const match = rawUrl.match(/^https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/[^\/]+\/.+$/);
  
  if (match) {
    const [, owner, repo] = match;
    return `https://github.com/${owner}/${repo}`;
  }
  
  return null;
}

/**
 * Generate URL mappings from PROCESSING_CONFIG specs
 * @param {Array} specs - Array of spec configurations from PROCESSING_CONFIG
 * @returns {Array} - Array of URL mappings
 */
export function generateUrlMappings(specs) {
  const mappings = [];
  
  specs.forEach(spec => {
    if (spec.githubUrl) {
      const repoUrl = convertRawUrlToRepoUrl(spec.githubUrl);
      if (repoUrl) {
        mappings.push({
          from: repoUrl,
          to: `/${spec.name}/`
        });
      }
    }
  });
  
  return mappings;
}

/**
 * URL mappings generated from PROCESSING_CONFIG specs
 * This is the single source of truth for URL transformations
 */
const URL_MAPPINGS = generateUrlMappings(PROCESSING_CONFIG.specs);

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply URL transformations to content
 * @param {string} content - The content to process
 * @param {Array} [urlMappings] - Optional custom URL mappings, defaults to URL_MAPPINGS
 * @returns {string} - The processed content with transformed URLs
 */
export function standardizeUCANLinks(content, urlMappings = URL_MAPPINGS) {
  let processed = content;
  
  // Apply each URL mapping
  urlMappings.forEach(({ from, to }) => {
    // Create variants with and without trailing slash (only for base URLs without hashes)
    const fromVariants = [
      from,
      from.endsWith('/') ? from.slice(0, -1) : from + '/'
    ];
    
    fromVariants.forEach(fromUrl => {
      const escapedUrl = escapeRegex(fromUrl);
      
      // Replace in direct links with optional hash: [text](url#hash) -> [text](local-url#hash)
      const linkPattern = new RegExp(`\\[([^\\]]+)\\]\\(${escapedUrl}(#[^)]*)?\\)`, 'g');
      processed = processed.replace(linkPattern, (match, linkText, hash) => {
        return `[${linkText}](${to}${hash || ''})`;
      });
      
      // Replace in reference definitions with optional hash: [label]: url#hash -> [label]: local-url#hash
      const refPattern = new RegExp(`^(\\s*\\[[^\\]]+\\]):\\s*${escapedUrl}(#[^\\s]*)?\\s*$`, 'gm');
      processed = processed.replace(refPattern, (match, label, hash) => {
        return `${label}: ${to}${hash || ''}`;
      });
    });
  });
  
  return processed;
}

/**
 * Check for UCAN link issues in content (for dry-run analysis)
 * @param {string} content - The content to analyze
 * @returns {Array} - Array of issue descriptions
 */
export function checkUCANLinkIssues(content) {
  const issues = [];
  
  // Check for GitHub URLs that should be converted to local links
  URL_MAPPINGS.forEach(({ from, to }) => {
    const variants = [
      from,
      from.endsWith('/') ? from.slice(0, -1) : from + '/'
    ];
    
    variants.forEach(url => {
      const escapedUrl = escapeRegex(url);
      
      // Check for direct links that need conversion (with optional hash)
      const linkPattern = new RegExp(`\\[([^\\]]+)\\]\\(${escapedUrl}(#[^)]*)?\\)`, 'g');
      const linkMatches = content.match(linkPattern);
      if (linkMatches) {
        issues.push(`${linkMatches.length} links pointing to ${url} (should be ${to})`);
      }
      
      // Check for reference definitions that need conversion (with optional hash)
      const refPattern = new RegExp(`^\\s*\\[[^\\]]+\\]:\\s*${escapedUrl}(#[^\\s]*)?\\s*$`, 'gm');
      const refMatches = content.match(refPattern);
      if (refMatches) {
        issues.push(`${refMatches.length} reference definitions pointing to ${url} (should be ${to})`);
      }
    });
  });
  
  return issues;
}
