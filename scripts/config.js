// Configuration for the UCAN documentation processing script

export const PROCESSING_CONFIG = {
  // Spec processing order (based on dependencies)
  specOrder: [
    { name: 'specification', source: 'spec', title: 'UCAN Specification' },
    { name: 'delegation', source: 'delegation', title: 'UCAN Delegation' },
    { name: 'invocation', source: 'invocation', title: 'UCAN Invocation' },
    { name: 'promise', source: 'promise', title: 'UCAN Promise' },
    { name: 'revocation', source: 'revocation', title: 'UCAN Revocation' },
    { name: 'varsig', source: 'varsig', title: 'Variable Signature (Varsig)' },
    { name: 'container', source: 'container', title: 'UCAN Container' },
  ],

  // Link mappings for cross-references
  linkMappings: {
    // Cross-spec links
    '[UCAN]': '/specification/',
    '[UCAN Delegation]': '/delegation/',
    '[UCAN Invocation]': '/invocation/',
    '[UCAN Promise]': '/promise/',
    '[UCAN Revocation]': '/revocation/',
    '[delegation]': '/delegation/',
    '[invocation]': '/invocation/',
    '[promise]': '/promise/',
    '[revocation]': '/revocation/',
    '[UCAN Envelope]': '/specification/#ucan-envelope',
    
    // GitHub links (keep as external)
    'https://github.com/ucan-wg/spec': 'https://github.com/ucan-wg/spec',
    'https://github.com/ucan-wg/delegation': 'https://github.com/ucan-wg/delegation',
    'https://github.com/ucan-wg/invocation': 'https://github.com/ucan-wg/invocation',
    'https://github.com/ucan-wg/revocation': 'https://github.com/ucan-wg/revocation',
  },

  // Sections to remove from processed documents
  sectionsToRemove: [
    'Editors',
    'Authors', 
    'Dependencies',
    'Language'
  ],

  // Sidebar configuration
  sidebarConfig: {
    sidebar: [
      {
        label: 'Overview',
        items: [
          { label: 'Introduction', slug: 'specification' },
        ],
      },
      {
        label: 'Guides',
        autogenerate: { directory: 'guides' },
      },
      {
        label: 'Core Specifications',
        items: [
          { label: 'Delegation', slug: 'delegation' },
          { label: 'Invocation', slug: 'invocation' },
          { label: 'Promise', slug: 'promise' },
          { label: 'Revocation', slug: 'revocation' },
        ],
      },
      {
        label: 'Transport',
        items: [
          { label: 'Container Format', slug: 'container' },
        ],
      },
      {
        label: 'Utilities',
        items: [
          { label: 'Variable Signature', slug: 'varsig' },
        ],
      },
    ],
  },

  // Options for processing
  options: {
    // Whether to process IPLD schema files
    processSchemas: true,
    
    // Whether to create a backup of existing files
    createBackup: false,
    
    // Whether to update the landing page
    updateLandingPage: true,
    
    // Whether to remove the title from markdown body to avoid duplication with frontmatter
    removeTitleFromBody: true,
    
    // Maximum description length for frontmatter
    maxDescriptionLength: 160,
  }
};
