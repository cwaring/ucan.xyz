---
title: "UCAN Examples"
description: "Practical examples of using UCAN for authorization and delegation"
sidebar:
  label: "Examples"
  order: 2
---

This page contains practical examples of using UCAN for various authorization scenarios.

> **Note**: These examples show the conceptual structure and high-level API patterns. Actual implementations may vary depending on the UCAN library you're using. Refer to the specific library documentation for exact API details.

> **Version Note**: Different UCAN library implementations are at different stages of the specification. JavaScript (`iso-ucan`) implements the latest specification, Rust (`ucan`) implements v0.10.0-canary, and Go (`go-ucan`) implements v1.0.0-rc.1. API patterns and payload structures may differ between versions.

## Example 1: File System Access

### Scenario
Alice wants to give Bob temporary read access to a specific file.

### Implementation using iso-ucan

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
  cmd: 'file:///alice/documents/report.pdf#read',
})

// Generate keypairs for Alice and Bob
const alice = await EdDSASigner.generate()
const bob = await EdDSASigner.generate()

const nowInSeconds = Math.floor(Date.now() / 1000)

// Alice delegates file read capability to Bob
const delegation = await FileReadCap.delegate({
  iss: alice,    // Alice issues the delegation
  aud: bob,      // Bob is the audience who receives the capability
  sub: alice,    // Alice is the subject (resource owner)
  pol: [],      // No additional policies
  exp: nowInSeconds + 3600, // Expires in 1 hour
})

// Store the delegation for later verification
await store.set(delegation)

// Bob can now invoke the capability to read the file
const invocation = await FileReadCap.invoke({
  iss: bob,      // Bob is invoking the capability
  sub: alice,    // Alice is the resource owner
  args: {},      // No additional arguments for this capability
  store,         // Store containing the delegation chain
  exp: nowInSeconds + 300, // Invocation expires in 5 minutes
})
```

## Example 2: API Rate Limiting

### Scenario
A service wants to delegate API access with rate limiting constraints.

### Implementation using iso-ucan

```javascript
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

// Set up store for delegation management
const store = new Store(new MemoryDriver())

// Define the API read capability with rate limiting schema
const ApiReadCap = Capability.from({
  schema: z.object({
    rate_limit: z.object({
      requests_per_hour: z.number(),
      reset_time: z.string()
    })
  }),
  cmd: 'https://service.example.com/api/users#read',
})

// Generate keypairs for service and client
const service = await EdDSASigner.generate()
const client = await EdDSASigner.generate()

const nowInSeconds = Math.floor(Date.now() / 1000)

// Service delegates API access to client with rate limiting
const delegation = await ApiReadCap.delegate({
  iss: service,  // Service issues the delegation
  aud: client,   // Client receives the capability
  sub: service,  // Service owns the API resource
  pol: [],      // No additional policies
  exp: nowInSeconds + 86400, // Expires in 24 hours
})

await store.set(delegation)

// Client can invoke the capability with rate limiting parameters
const invocation = await ApiReadCap.invoke({
  iss: client,   // Client is invoking the capability
  sub: service,  // Service is the resource owner
  args: {
    rate_limit: { 
      requests_per_hour: 100, 
      reset_time: "hourly" 
    }
  },
  store,         // Store containing the delegation chain
  exp: nowInSeconds + 300, // Invocation expires in 5 minutes
})
```

## Real-World Implementation Notes

### Complete Example with Account Creation

Here's a more comprehensive example following the pattern from the `iso-ucan` documentation:

```javascript
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

const store = new Store(new MemoryDriver())

// Define account creation capability
const AccountCreateCap = Capability.from({
  schema: z.object({
    type: z.string(),
    properties: z.object({
      name: z.string(),
    }).strict(),
  }),
  cmd: '/account/create',
})

// Define general account capability
const AccountCap = Capability.from({
  schema: z.never(),
  cmd: '/account',
})

// Generate keypairs for all parties
const owner = await EdDSASigner.generate()
const bob = await EdDSASigner.generate()
const invoker = await EdDSASigner.generate()

const nowInSeconds = Math.floor(Date.now() / 1000)

// Owner delegates account capability to Bob
const ownerDelegation = await AccountCap.delegate({
  iss: owner,
  aud: bob,
  sub: owner,
  pol: [],
  exp: nowInSeconds + 1000,
})

await store.set(ownerDelegation)

// Bob further delegates to invoker
const bobDelegation = await AccountCap.delegate({
  iss: bob,
  aud: invoker,
  sub: owner,
  pol: [],
  exp: nowInSeconds + 1000,
})

await store.set(bobDelegation)

// Invoker can now create an account using the delegation chain
const invocation = await AccountCreateCap.invoke({
  iss: invoker,
  sub: owner,
  args: {
    type: 'account',
    properties: {
      name: 'John Doe',
    },
  },
  store,
  exp: nowInSeconds + 1000,
})
```

### Other UCAN Library Examples

While this guide focuses on `iso-ucan`, here are examples for other popular implementations:

#### JavaScript (iso-ucan)
The examples above demonstrate the current `iso-ucan` API. For the latest documentation, refer to the [`iso-ucan` package documentation](https://github.com/hugomrdias/iso-repo/tree/main/packages/iso-ucan).

#### Rust (ucan)
```rust
use ucan::builder::UcanBuilder;
use ucan::crypto::KeyMaterial;

let ucan = UcanBuilder::default()
    .issued_by(&issuer_key)
    .for_audience(&audience_did)
    .with_lifetime(3600)
    .claiming_capability(&capability)
    .build()?;
```

#### Go (go-ucan)
```go
import "github.com/ucan-wg/go-ucan"

token, err := ucan.NewBuilder().
    IssuedBy(issuerKey).
    ToAudience(audienceDID).
    WithLifetime(time.Hour).
    ClaimCapability(capability).
    Build()
```

### Transport and Storage

UCANs in `iso-ucan` are handled as structured objects that can be serialized for transport and storage as needed by your application.

## Best Practices

### Security Considerations

1. **Principle of Least Authority (PoLA)**: Only delegate the minimum necessary permissions
   ```javascript
   // Good: Specific resource and capability
   const FileReadCap = Capability.from({
     schema: z.never(),
     cmd: 'file:///alice/documents/report.pdf#read',
   })
   
   // Avoid: Overly broad permissions  
   const AllFilesCap = Capability.from({
     schema: z.never(),
     cmd: 'file:///alice/*#*',
   })
   ```

2. **Short Expiry Times**: Use the shortest practical expiration times
   ```javascript
   // Good: Short-lived for temporary access
   exp: nowInSeconds + 3600 // 1 hour
   
   // Good: Longer for trusted devices  
   exp: nowInSeconds + 2592000 // 30 days
   
   // Avoid: Very long expiration unless absolutely necessary
   exp: nowInSeconds + 31536000 // 1 year
   ```

3. **Specific Capabilities**: Be as specific as possible in capability definitions
4. **Secure Key Management**: Keep private keys secure and never share them

### Implementation Guidelines

1. **Proper Error Handling**: Always handle UCAN verification failures gracefully
2. **Caching and Performance**: Cache verification results when appropriate  
3. **Audit Logging**: Log UCAN usage for security auditing

## Resources and Further Reading

### Specification Documents
- [UCAN Delegation Specification](/delegation/) - Core delegation mechanism
- [UCAN Invocation Specification](/invocation/) - How to exercise capabilities  
- [UCAN Policy Language](/delegation/#policy) - Detailed policy syntax
- [UCAN Revocation Specification](/revocation/) - Capability revocation

### Implementation Libraries
- **JavaScript**: [`iso-ucan`](https://github.com/hugomrdias/iso-repo/tree/main/packages/iso-ucan) (NPM: `iso-ucan`)
- **Rust**: [`ucan`](https://github.com/ucan-wg/rs-ucan) 
- **Go**: [`go-ucan`](https://github.com/ucan-wg/go-ucan)
- **Haskell**: [`hs-ucan`](https://github.com/fission-suite/fission)

### Community and Support
- [UCAN Working Group](https://github.com/ucan-wg) - Main GitHub organization
- [Specification Repository](https://github.com/ucan-wg/spec) - Latest specification updates
- [Community Discussions](https://github.com/ucan-wg/spec/discussions) - Ask questions and share ideas

> **Note**: UCAN is an evolving specification. Always refer to the latest version of the specifications and library documentation for the most current information.
