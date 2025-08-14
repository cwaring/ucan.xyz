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

### UCAN Delegation Structure

```javascript
// UCAN Delegation (conceptual structure - actual format may vary by library)
const delegation = {
  // Standard JWT header
  header: {
    alg: "EdDSA",
    typ: "JWT",
    uav: "1.0.0" // UCAN version (varies by implementation)
  },
  
  // UCAN payload (conceptual - see library docs for exact format)
  payload: {
    iss: "did:key:z6Mkv...", // Alice's DID (issuer)
    aud: "did:key:z6Mk3...", // Bob's DID (audience)
    sub: "did:key:z6Mkv...", // Subject (Alice owns the resource)
    att: [{                  // Attenuation (capabilities) - actual format varies
      with: { scheme: "file", hierPart: "///alice/documents/report.pdf" },
      can: { namespace: "fs", segments: ["read"] }
    }],
    exp: Math.floor(Date.now() / 1000) + 3600, // Unix timestamp (1 hour)
    nbf: Math.floor(Date.now() / 1000),        // Not before (now)
    iat: Math.floor(Date.now() / 1000),        // Issued at
    fct: []                                    // Facts (empty)
  },
  
  // Signature (calculated)
  signature: "..." // EdDSA signature over header.payload
};
```

### High-Level API Usage

```javascript
// Using the JavaScript UCAN library
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

// Alice creates the file read capability and delegates to Bob
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
  exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
})

// Store the delegation for later verification
await store.set(delegation)

// Bob can verify and use the delegation by invoking the capability
const invocation = await FileReadCap.invoke({
  iss: bob,
  sub: alice,
  args: {},
  store,
  exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
})
```

## Example 2: API Rate Limiting

### Scenario
A service wants to delegate API access with rate limiting constraints.

### UCAN Delegation Structure

```javascript
// API access delegation with rate limiting (conceptual structure)
const apiDelegation = {
  header: {
    alg: "EdDSA",
    typ: "JWT",
    uav: "1.0.0" // Version varies by implementation
  },
  payload: {
    iss: "did:key:z6Mkservice...", // Service DID
    aud: "did:key:z6Mkclient...",  // Client DID
    sub: "did:key:z6Mkservice...", // Service owns the API
    att: [{                        // Attenuation (capabilities) 
      with: { scheme: "https", hierPart: "//service.example.com/api/users" },
      can: { namespace: "api", segments: ["read"] }
    }],
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    nbf: Math.floor(Date.now() / 1000),
    iat: Math.floor(Date.now() / 1000),
    fct: [
      { "rate_limit": { "requests_per_hour": 100, "reset_time": "hourly" } }
    ]
  }
};
```

### High-Level API Usage

```javascript
// Service delegates API access using JavaScript library
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

const store = new Store(new MemoryDriver())

const ApiReadCap = Capability.from({
  schema: z.object({
    rate_limit: z.object({
      requests_per_hour: z.number(),
      reset_time: z.string()
    }).optional()
  }),
  cmd: 'https://service.example.com/api/users#read',
})

const service = await EdDSASigner.generate()
const client = await EdDSASigner.generate()

const apiAccess = await ApiReadCap.delegate({
  iss: service,
  aud: client,
  sub: service,
  pol: [],
  exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
})

await store.set(apiAccess)

// Client can invoke the capability
const invocation = await ApiReadCap.invoke({
  iss: client,
  sub: service,
  args: {
    rate_limit: { requests_per_hour: 100, reset_time: "hourly" }
  },
  store,
  exp: Math.floor(Date.now() / 1000) + 300,
})
```

## Real-World Implementation Notes

### Library-Specific APIs

Different UCAN libraries may have different APIs. Here are examples for popular implementations:

#### JavaScript (iso-ucan)
```javascript
import { Capability } from 'iso-ucan/capability'
import { Store } from 'iso-ucan/store'
import { MemoryDriver } from 'iso-kv/drivers/memory'
import { EdDSASigner } from 'iso-signatures/signers/eddsa.js'
import { z } from 'zod'

const store = new Store(new MemoryDriver())
const FileCap = Capability.from({
  schema: z.never(),
  cmd: 'wnfs://boris.fission.name/public/photos/#overwrite',
})

const keypair = await EdDSASigner.generate()
const audience = await EdDSASigner.generate()
const delegation = await FileCap.delegate({
  iss: keypair,
  aud: audience,
  sub: keypair,
  pol: [],
  exp: Math.floor(Date.now() / 1000) + 3600
})
```

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

UCANs are typically encoded as JWTs for transport:

```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsInVhdiI6IjEuMC4wIn0.
eyJpc3MiOiJkaWQ6a2V5Ono2TWt2...(base64url encoded payload)...
kzJWVmYW1lZ...(signature)
```

## Best Practices

### Security Considerations

1. **Principle of Least Authority (PoLA)**: Only delegate the minimum necessary permissions
   ```javascript
   // Good: Specific resource and ability
   { 
     with: { scheme: "file", hierPart: "///alice/documents/report.pdf" },
     can: { namespace: "fs", segments: ["read"] }
   }
   
   // Avoid: Overly broad permissions  
   { 
     with: { scheme: "file", hierPart: "///alice/*" },
     can: { namespace: "fs", segments: ["*"] }
   }
   ```

2. **Short Expiry Times**: Use the shortest practical expiration times
   ```javascript
   // Good: Short-lived for temporary access
   lifetimeInSeconds: 3600 // 1 hour
   
   // Good: Longer for trusted devices  
   lifetimeInSeconds: 2592000 // 30 days
   
   // Avoid: No expiration unless absolutely necessary
   expiration: Infinity // Never expires
   ```

3. **Specific Policies**: Be as specific as possible in policy constraints
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
