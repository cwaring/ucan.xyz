---
title: "Getting Started with UCAN"
description: "A beginner's guide to understanding and using User Controlled Authorization Network (UCAN)"
sidebar:
  label: "Getting Started"
  order: 1
---

This guide provides a quick introduction to UCAN (User Controlled Authorization Network) and walks you through building your first UCAN-enabled application.

> **Implementation Note**: This guide uses the JavaScript UCAN library (`iso-ucan`) for code examples. Different UCAN libraries may have varying APIs and support different specification versions. Always refer to your chosen library's documentation for exact implementation details.

## What is UCAN?

UCAN is a **decentralized authorization system** that enables secure, offline-capable delegation of permissions without requiring centralized servers or sharing cryptographic keys.

### Core Benefits

- 🔑 **No shared secrets** - Delegate authority without sharing private keys
- 🌐 **Offline-first** - Work without internet connectivity or central servers  
- 🔗 **Chainable** - Create delegation chains across multiple parties
- 🛡️ **Cryptographically secure** - Built on proven public-key cryptography
- ⚡ **Locally verifiable** - No network calls needed for authorization

### How UCAN Differs from Traditional Auth

| Traditional Auth (OAuth, etc.) | UCAN |
|--------------------------------|------|
| Centralized authorization server | Decentralized, peer-to-peer |
| Online verification required | Offline verification possible |
| Shared secrets or tokens | Public-key cryptography |
| Revocation requires server | Revocation via cryptographic proofs |

## Core Concepts

### Capabilities vs Permissions

**Traditional Access Control Lists (ACLs)** define who can do what:
```
Users Table:
- Alice: can read file.txt, write file.txt
- Bob: can read file.txt  
- Charlie: can read file.txt, delete file.txt
```

UCAN uses **capabilities** - tokens that grant specific abilities:
```
Token A grants "read file.txt"
Token B grants "write file.txt"
```

### Delegation Chains

UCAN enables secure delegation without key sharing:

```mermaid
graph TD
    A[Alice Root Authority] -->|delegates read| B[Bob Capability]
    B -->|delegates read| C[Charlie Capability] 
    C -->|exercises capability| D[File System Grants Access]
```

Each delegation:
- ✅ Is cryptographically signed by the delegator
- ✅ Can be verified independently 
- ✅ Can include additional restrictions (attenuation)
- ✅ Has built-in expiration

### Verification Without Servers

```mermaid
graph LR
    A[Charlie's Request] --> B[Local Verification]
    B --> C{Valid Chain?}
    C -->|Yes| D[Grant Access]
    C -->|No| E[Deny Access]
    
    F[Alice's Public Key] --> B
    G[Bob's Delegation] --> B
    H[Charlie's Delegation] --> B
```

## Core Specifications

### [UCAN Delegation](/delegation/)
The foundation of UCAN - how to create and delegate capabilities.

**Key features:**
- Cryptographically verifiable
- Hierarchical authority
- Expiration times
- Policy language for conditions

### [UCAN Invocation](/invocation/)
How to execute the capabilities you've been delegated.

**Key features:**
- Clear intention to act
- Proof of authorization
- Execution receipts
- Causal relationships

### [UCAN Revocation](/revocation/)
How to revoke capabilities after they've been issued.

**Key features:**
- Manual invalidation
- Revocation chains
- Last resort security

## Common Use Cases

### 1. File System Access
```javascript
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

// Set up store for delegation management
const store = new Store(new MemoryDriver())

// Define the file read capability
const FileReadCap = Capability.from({
  schema: z.never(),
  cmd: '/file/read',
})

// Generate keypairs for Alice and Bob
const alice = await EdDSASigner.generate()
const bob = await EdDSASigner.generate()

const nowInSeconds = Math.floor(Date.now() / 1000)

// Alice delegates read access to Bob
const delegation = await FileReadCap.delegate({
  iss: alice,    // Alice issues the delegation
  aud: bob,      // Bob receives the capability
  sub: alice,    // Alice owns the resource
  pol: [],      // No additional policies
  exp: nowInSeconds + 3600 // Expires in 1 hour
})

// Store the delegation for later use
await store.set(delegation)

// Bob can verify and use the delegation by creating an invocation
  const readFile = await invoke({
    issuer: aliceSession,
    audience: serviceSession.did(),
    capability: {
      can: '/file/read',
      with: 'https://example.com/files/report.pdf',
    },
    proofs: [delegation],
  })
```

### 2. API Access
```javascript
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

const store = new Store(new MemoryDriver())

// Define API access capability with rate limiting constraints
const ApiReadCap = Capability.from({
  schema: z.object({
    rateLimit: z.object({
      requests_per_hour: z.number()
    }),
    scope: z.string()
  }),
  cmd: '/api/users/read',
})

const service = await EdDSASigner.generate()
const user = await EdDSASigner.generate()

const nowInSeconds = Math.floor(Date.now() / 1000)

// Service delegates API access to user
const delegation = await ApiReadCap.delegate({
  iss: service,  // Service issues the delegation
  aud: user,     // User receives the capability
  sub: service,  // Service owns the API
  pol: [],      // No additional policies
  exp: nowInSeconds + 86400, // Expires in 24 hours
})

await store.set(delegation)

// User can invoke the capability
const invocation = await ApiReadCap.invoke({
  iss: user,
  sub: service,
  args: {
    rateLimit: { requests_per_hour: 100 },
    scope: "read"
  },
  store,
  exp: nowInSeconds + 300,
})
```

### 3. Collaborative Documents
```javascript
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

const store = new Store(new MemoryDriver())

// Define document edit capability with constraints
const DocEditCap = Capability.from({
  schema: z.object({
    allowedSections: z.array(z.string()),
    expiry: z.string()
  }),
  cmd: '/document/edit',
})

const alice = await EdDSASigner.generate()
const collaborator = await EdDSASigner.generate()

const nowInSeconds = Math.floor(Date.now() / 1000)

// Alice shares edit access to document
const delegation = await DocEditCap.delegate({
  iss: alice,        // Alice issues the delegation
  aud: collaborator, // Collaborator receives the capability
  sub: alice,        // Alice owns the document
  pol: [],          // No additional policies
  exp: nowInSeconds + 604800, // Expires in 1 week
})

await store.set(delegation)

// Collaborator can invoke the capability to edit
const invocation = await DocEditCap.invoke({
  iss: collaborator,
  sub: alice,
  args: {
    allowedSections: ["introduction", "methodology"],
    expiry: "2026-12-31T23:59:59Z"
  },
  store,
  exp: nowInSeconds + 300,
})
```

## Next Steps

1. **Read the specifications** - Start with the [UCAN Delegation](/delegation/) spec
2. **Explore examples** - Check out the detailed [Examples](/guides/examples/) page
3. **Try an implementation** - Choose a UCAN library for your preferred language
4. **Join the community** - Participate in discussions on the UCAN GitHub

## Additional Resources

- [UCAN Website](https://ucan.xyz)
- [UCAN GitHub Working Group](https://github.com/ucan-wg/)
- [Implementation Libraries](/libraries/)
  - **JavaScript**: [`iso-ucan`](/libraries/javascript/) (NPM: `iso-ucan`)
  - **Rust**: [`ucan`](/libraries/rust/)
  - **Go**: [`go-ucan`](/libraries/go/)

## Questions?

Common questions about UCAN:

**Q: How is UCAN different from OAuth?**
A: OAuth requires online authorization servers. UCAN works offline and doesn't need central authorities.

**Q: Can I revoke a UCAN after issuing it?**
A: Yes, through the [UCAN Revocation](/revocation/) mechanism, though this requires the revocation message to be delivered.

**Q: Are UCANs secure?**
A: UCANs use public-key cryptography and are designed with security best practices. However, they require proper implementation and key management.

**Q: Can I use UCAN with existing systems?**
A: Yes! UCAN is designed to wrap existing authorization systems while adding its benefits.
