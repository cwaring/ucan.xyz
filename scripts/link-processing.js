/**
 * Shared link processing utilities for UCAN documentation
 * Used by both simple-review.js and process-docs.js to ensure consistency
 * 
 * This is the SINGLE SOURCE OF TRUTH for all UCAN link processing
 */

/**
 * Master link definitions - the single source of truth for all UCAN links
 * This object defines all possible link targets and their variations
 */
export const UCAN_LINKS = {
  // Main UCAN specifications
  'UCAN': {
    url: '/specification/',
    variants: ['UCAN', 'ucan', 'high level spec']
  },
  'UCAN Delegation': {
    url: '/delegation/',
    variants: ['UCAN Delegation', 'delegation']
  },
  'UCAN Invocation': {
    url: '/invocation/',
    variants: ['UCAN Invocation', 'invocation']
  },
  'UCAN Envelope': {
    url: '/specification/#ucan-envelope',
    variants: ['UCAN Envelope', 'envelope']
  },
  'UCAN Promise': {
    url: '/promise/',
    variants: ['UCAN Promise', 'promise']
  },
  'UCAN Revocation': {
    url: '/revocation/',
    variants: ['UCAN Revocation', 'revocation']
  },
  'UCAN Container': {
    url: '/container/',
    variants: ['UCAN Container', 'container']
  },
  'Variable Signature': {
    url: '/varsig/',
    variants: ['Variable Signature', 'varsig']
  }
};

/**
 * Generate all link fix patterns from the master UCAN_LINKS definition
 */
function generateLinkFixes() {
  const fixes = [];
  
  Object.entries(UCAN_LINKS).forEach(([name, { url, variants }]) => {
    variants.forEach(variant => {
      // Direct link fixes: [variant](other-url) → [variant](correct-url)
      fixes.push({
        name: variant,
        pattern: new RegExp(`\\[${escapeRegex(variant)}\\]\\((?!${escapeRegex(url)})([^)]*)\\)`, 'g'),
        replacement: `[${variant}](${url})`
      });
      
      // Reference-style link fixes: [variant][ref] → [variant](correct-url)
      fixes.push({
        name: `${variant} reference`,
        pattern: new RegExp(`\\[${escapeRegex(variant)}\\]\\[\\w+\\]`, 'g'),
        replacement: `[${variant}](${url})`
      });
      
      // Standalone link fixes: [variant] → [variant](correct-url) (but not [variant]: or [variant]( )
      fixes.push({
        name: `${variant} standalone`,
        pattern: new RegExp(`\\[${escapeRegex(variant)}\\](?!\\(|\\[|:)`, 'g'),
        replacement: `[${variant}](${url})`
      });
    });
  });
  
  return fixes;
}

/**
 * Generate reference link mappings from the master UCAN_LINKS definition
 */
function generateReferenceMappings() {
  const mappings = {};
  
  Object.entries(UCAN_LINKS).forEach(([name, { url, variants }]) => {
    variants.forEach(variant => {
      mappings[`[${variant}]`] = url;
    });
  });
  
  return mappings;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Generate all patterns from the master definition
const ALL_LINK_FIXES = generateLinkFixes();
const REFERENCE_MAPPINGS = generateReferenceMappings();

/**
 * Apply all UCAN link standardization fixes to content
 * @param {string} content - The content to process
 * @returns {string} - The processed content with standardized links
 */
export function standardizeUCANLinks(content) {
  let processed = content;
  
  // Apply all generated link fixes
  for (const { pattern, replacement } of ALL_LINK_FIXES) {
    processed = processed.replace(pattern, replacement);
  }
  
  return processed;
}

/**
 * Apply reference link mappings to content (for process-docs.js)
 * @param {string} content - The content to process
 * @returns {string} - The processed content with mapped reference links
 */
export function applyReferenceLinkMappings(content) {
  let processed = content;
  
  // Apply generated reference mappings to reference-style definitions
  Object.entries(REFERENCE_MAPPINGS).forEach(([pattern, replacement]) => {
    // Handle reference-style link definitions like [UCAN]: some-url
    const refPattern = new RegExp(`\\${pattern}:\\s*[^\\s]+`, 'g');
    processed = processed.replace(refPattern, `${pattern}: ${replacement}`);
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
  
  // Check for each type of inconsistent link using generated fixes
  for (const { name, pattern } of ALL_LINK_FIXES) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push(`${matches.length} inconsistent ${name} links`);
    }
  }
  
  return issues;
}
