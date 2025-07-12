// Configuration for the UCAN documentation processing script

export const PROCESSING_CONFIG = {
  // Specifications to process - fetched directly from GitHub
  specs: [
    { 
      name: 'specification', 
      title: 'UCAN Specification',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/spec/main/README.md',
      schemaUrl: null // No schema file for main spec
    },
    { 
      name: 'delegation', 
      title: 'UCAN Delegation',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/delegation/main/README.md',
      schemaUrl: 'https://raw.githubusercontent.com/ucan-wg/delegation/main/delegation.ipldsch'
    },
    { 
      name: 'invocation', 
      title: 'UCAN Invocation',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/invocation/main/README.md',
      schemaUrl: 'https://raw.githubusercontent.com/ucan-wg/invocation/main/invocation.ipldsch'
    },
    { 
      name: 'promise', 
      title: 'UCAN Promise',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/promise/main/README.md',
      schemaUrl: null // No schema file yet
    },
    { 
      name: 'revocation', 
      title: 'UCAN Revocation',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/revocation/main/README.md',
      schemaUrl: 'https://raw.githubusercontent.com/ucan-wg/revocation/main/revocation.ipldsch'
    },
    { 
      name: 'varsig', 
      title: 'Variable Signature',
      githubUrl: 'https://raw.githubusercontent.com/ChainAgnostic/varsig/main/README.md',
      schemaUrl: null // No schema file
    },
    { 
      name: 'container', 
      title: 'UCAN Container',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/container/main/Readme.md',
      schemaUrl: null // No schema file
    },
    // Libraries
    { 
      name: 'libraries/typescript', 
      title: 'TypeScript Implementation',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/ts-ucan/main/README.md',
      schemaUrl: null
    },
    { 
      name: 'libraries/rust', 
      title: 'Rust Implementation',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/rs-ucan/main/README.md',
      schemaUrl: null
    },
    { 
      name: 'libraries/go', 
      title: 'Go Implementation',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/go-ucan/main/Readme.md',
      schemaUrl: null
    },
    { 
      name: 'libraries/haskell', 
      title: 'Haskell Implementation',
      githubUrl: 'https://raw.githubusercontent.com/fission-suite/fission/main/hs-ucan/README.md',
      schemaUrl: null
    },
    { 
      name: 'libraries/js-dag-ucan', 
      title: 'UCAN IPLD (JavaScript)',
      githubUrl: 'https://raw.githubusercontent.com/ipld/js-dag-ucan/main/README.md',
      schemaUrl: null
    },
    { 
      name: 'libraries/ucanto', 
      title: 'UCAN-RPC (JavaScript)',
      githubUrl: 'https://raw.githubusercontent.com/storacha/ucanto/main/Readme.md',
      schemaUrl: null
    },
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
        label: 'References',
        items: [
          { label: 'Variable Signature', slug: 'varsig' },
        ],
      },
      {
        label: 'Libraries',
        items: [
          { label: 'TypeScript', slug: 'libraries/typescript' },
          { label: 'Rust', slug: 'libraries/rust' },
          { label: 'Go', slug: 'libraries/go' },
          { label: 'Haskell', slug: 'libraries/haskell' },
          { label: 'UCAN IPLD (JS)', slug: 'libraries/js-dag-ucan' },
          { label: 'UCAN-RPC (JS)', slug: 'libraries/ucanto' },
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
