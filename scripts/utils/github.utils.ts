// GitHub-related utility functions for UCAN documentation processing

/**
 * Convert a GitHub raw URL to an edit URL
 * @param rawUrl - The raw GitHub URL
 * @returns The corresponding edit URL
 */
export function convertToEditUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return null;
  }
  
  // Match pattern: https://raw.githubusercontent.com/owner/repo/branch/path
  const match = rawUrl.match(/^https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)$/);
  
  if (match) {
    const [, owner, repo, branch, filepath] = match;
    return `https://github.com/${owner}/${repo}/blob/${branch}/${filepath}`;
  }
  
  return null;
}
