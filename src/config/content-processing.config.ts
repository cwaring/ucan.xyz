// Configuration for the UCAN documentation processing

import { defineProcessingConfig } from '../../scripts/types/processing.types.js';

export default defineProcessingConfig({
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
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/promise/refs/heads/v1-rc1/README.md',
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
      name: 'libraries/javascript', 
      title: 'JavaScript Implementation',
      githubUrl: 'https://raw.githubusercontent.com/hugomrdias/iso-repo/refs/heads/main/packages/iso-ucan/readme.md',
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
  ],

  // Sections to remove from processed documents
  // Format: 'headerDepth sectionName' (e.g., '## Editors', '### Metadata')
  sectionsToRemove: [
    '## Editors',
    '## Authors', 
    '## Dependencies',
    '## Language'
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
          { label: 'Promise', slug: 'promise', badge: 'draft' },
          { label: 'Revocation', slug: 'revocation' },
        ],
      },
      {
        label: 'References',
        items: [
          { label: 'Variable Signature', slug: 'varsig' },
          { label: 'Container', slug: 'container' },
        ],
      },
      {
        label: 'Libraries',
        items: [
          { label: 'JavaScript', slug: 'libraries/javascript' },
          { label: 'Rust', slug: 'libraries/rust' },
          { label: 'Go', slug: 'libraries/go' },
          { label: 'Implementation', slug: 'libraries/implementation' }
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
    
    // Whether to remove the title from markdown body to avoid duplication with frontmatter
    removeTitleFromBody: true,
    
    // Maximum description length for frontmatter
    maxDescriptionLength: 160,
  }
});
