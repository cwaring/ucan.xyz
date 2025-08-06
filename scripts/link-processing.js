/**
 * Shared link processing utilities for UCAN documentation
 * Used by both content-review.js and process-docs.js to ensure consistency
 * 
 * This is the SINGLE SOURCE OF TRUTH for all UCAN link processing
 */

/**
 * Simple URL mapping for converting GitHub URLs to local documentation links
 * This handles exact URL replacements and automatically preserves hash fragments
 */
export const URL_MAPPINGS = [
  { from: 'https://github.com/ucan-wg/spec', to: '/specification/' },
  { from: 'https://github.com/ucan-wg/delegation', to: '/delegation/' },
  { from: 'https://github.com/ucan-wg/invocation', to: '/invocation/' },
  { from: 'https://github.com/ucan-wg/promise', to: '/promise/' },
  { from: 'https://github.com/ucan-wg/revocation', to: '/revocation/' },
  { from: 'https://github.com/ucan-wg/container', to: '/container/' },
  { from: 'https://github.com/ChainAgnostic/varsig', to: '/varsig/' }
];

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply URL transformations to content
 * @param {string} content - The content to process
 * @returns {string} - The processed content with transformed URLs
 */
export function standardizeUCANLinks(content) {
  let processed = content;
  
  // Apply each URL mapping
  URL_MAPPINGS.forEach(({ from, to }) => {
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
