// TypeScript types for UCAN documentation processing

export interface SpecConfig {
  name: string;
  title: string;
  githubUrl: string;
  schemaUrl: string | null;
}

export interface SidebarItem {
  label: string;
  slug?: string;
  items?: SidebarItem[];
  autogenerate?: { directory: string };
}

export interface SidebarConfig {
  sidebar: SidebarItem[];
}

export interface ProcessingOptions {
  /** Whether to process IPLD schema files */
  processSchemas: boolean;
  /** Whether to create a backup of existing files */
  createBackup: boolean;
  /** Whether to remove the title from markdown body to avoid duplication with frontmatter */
  removeTitleFromBody: boolean;
  /** Maximum description length for frontmatter */
  maxDescriptionLength: number;
}

export interface ProcessingConfig {
  specs: SpecConfig[];
  sectionsToRemove: string[];
  sidebarConfig: SidebarConfig;
  options: ProcessingOptions;
}

/**
 * Helper function to define processing configuration with proper typing
 * @param config - The processing configuration object
 * @returns The same configuration object with type safety
 */
export function defineProcessingConfig(config: ProcessingConfig): ProcessingConfig {
  return config;
}
