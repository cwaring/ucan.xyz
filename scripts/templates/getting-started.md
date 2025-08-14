---
title: "Getting Started with UCAN"
description: "A beginner's guide to understanding and using User Controlled Authorization Network (UCAN)"
sidebar:
  label: "Getting Started"
  order: 1
---

This guide provides a gentle introduction to UCAN (User Controlled Authorization Network) and its core concepts.

> **Note**: The code examples in this guide use the JavaScript UCAN library (`iso-ucan`) for illustration. Different UCAN libraries may have different APIs and be at different specification versions. Always refer to your chosen library's documentation for exact API details.

## What is UCAN?

UCAN is a **trustless**, **secure**, **local-first**, **user-originated** authorization scheme that lets you:

- **Delegate authority** without sharing cryptographic keys
- **Work offline** with full authorization capabilities
- **Scale authorization** across distributed systems
- **Maintain user control** over their data and permissions

## Key Concepts

### 1. Capabilities vs Permissions

Traditional systems use **Access Control Lists (ACLs)** - a list of who can do what:
```
Alice can read file.txt
Bob can write file.txt
Charlie can read file.txt
```

UCAN uses **capabilities** - tokens that grant specific abilities:
```
Token A grants "read file.txt"
Token B grants "write file.txt"
```

### 2. Delegation

With UCAN, you can delegate authority to others without sharing your keys:

```mermaid
graph LR
    A[Alice] -->|delegates read permission| B[Bob]
    B -->|delegates read permission| C[Charlie]
    C -->|can now read file.txt| D[File System]
```

### 3. Verification

Each UCAN can be verified independently:
- **Cryptographic signatures** prove authenticity
- **Certificate chains** show delegation path
- **No central authority** needed for verification

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
// Using JavaScript UCAN library
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

// Alice creates a keypair and delegates read access to Bob
const store = new Store(new MemoryDriver())

const FileReadCap = Capability.from({
  schema: z.never(),
  cmd: 'file:///alice/documents/report.pdf#read',
})

const alice = await EdDSASigner.generate()
const bob = await EdDSASigner.generate()

const delegation = await FileReadCap.delegate({
  iss: alice,
  aud: bob,
  sub: alice,
  pol: [],
  exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
})

// Store the delegation for later use
await store.set(delegation)

// Bob can verify and use the delegation by creating an invocation
const invocation = await FileReadCap.invoke({
  iss: bob,
  sub: alice,
  args: {},
  store,
  exp: Math.floor(Date.now() / 1000) + 300,
})
```

### 2. API Access
```javascript
// Service owner delegates API access using JavaScript library
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

const store = new Store(new MemoryDriver())

const ApiReadCap = Capability.from({
  schema: z.object({
    rateLimit: z.object({
      requests_per_hour: z.number()
    }),
    scope: z.string()
  }),
  cmd: 'https://service.com/api/users#read',
})

const service = await EdDSASigner.generate()
const user = await EdDSASigner.generate()

const apiAccess = await ApiReadCap.delegate({
  iss: service,
  aud: user,
  sub: service,
  pol: [],
  exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
})
```

### 3. Collaborative Documents
```javascript
// Alice shares edit access to document using JavaScript library
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

const store = new Store(new MemoryDriver())

const DocEditCap = Capability.from({
  schema: z.object({
    allowedSections: z.array(z.string()),
    expiry: z.string()
  }),
  cmd: 'doc://alice/project-proposal#edit',
})

const alice = await EdDSASigner.generate()
const collaborator = await EdDSASigner.generate()

const editAccess = await DocEditCap.delegate({
  iss: alice,
  aud: collaborator,
  sub: alice,
  pol: [],
  exp: Math.floor(Date.now() / 1000) + 604800, // 1 week
})
```

## Next Steps

1. **Read the specifications** - Start with the [UCAN Delegation](/delegation/) spec
2. **Explore examples** - Check out the detailed [Examples](/guides/examples/) page
3. **Try an implementation** - Choose a UCAN library for your preferred language
4. **Join the community** - Participate in discussions on the UCAN GitHub

## Additional Resources

- [UCAN Website](https://ucan.xyz)
- [GitHub Repository](https://github.com/ucan-wg/spec)
- [Implementation Libraries](https://github.com/ucan-wg)
  - **JavaScript**: [`iso-ucan`](https://github.com/hugomrdias/iso-repo/tree/main/packages/iso-ucan) (NPM: `iso-ucan`)
  - **Rust**: [`ucan`](https://github.com/ucan-wg/rs-ucan)
  - **Go**: [`go-ucan`](https://github.com/ucan-wg/go-ucan)

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
