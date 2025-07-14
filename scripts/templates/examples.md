---
title: "UCAN Examples"
description: "Practical examples of using UCAN for authorization and delegation"
sidebar:
  label: "Examples"
  order: 2
---

This page contains practical examples of using UCAN for various authorization scenarios.

> **Note**: These examples show the conceptual structure and high-level API patterns. Actual implementations may vary depending on the UCAN library you're using. Refer to the specific library documentation for exact API details.

> **Version Note**: Different UCAN library implementations are at different stages of the specification. TypeScript (`@ucans/ucans`) implements v0.8.1, Rust (`ucan`) implements v0.10.0-canary, and Go (`go-ucan`) implements v1.0.0-rc.1. API patterns and payload structures may differ between versions.

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
// Using the TypeScript UCAN library
import * as ucans from "@ucans/ucans"

// Alice creates and signs the delegation
const aliceKeypair = await ucans.EdKeypair.create()
const bobDid = "did:key:z6Mk3..." // Bob's DID

const delegation = await ucans.build({
  audience: bobDid,
  issuer: aliceKeypair,
  capabilities: [{
    with: { scheme: "file", hierPart: "///alice/documents/report.pdf" },
    can: { namespace: "fs", segments: ["read"] }
  }],
  lifetimeInSeconds: 3600, // 1 hour
  facts: []
});

// Encode the UCAN for transport
const token = ucans.encode(delegation);

// Bob can verify and use the delegation
const result = await ucans.verify(token, {
  audience: bobDid,
  isRevoked: async ucan => false,
  requiredCapabilities: [{
    capability: {
      with: { scheme: "file", hierPart: "///alice/documents/report.pdf" },
      can: { namespace: "fs", segments: ["read"] }
    },
    rootIssuer: aliceKeypair.did()
  }]
});
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
// Service delegates API access using TypeScript library
import * as ucans from "@ucans/ucans"

const serviceKeypair = await ucans.EdKeypair.create()
const clientDid = "did:key:z6Mkclient..."

const apiAccess = await ucans.build({
  audience: clientDid,
  issuer: serviceKeypair,
  capabilities: [{
    with: { scheme: "https", hierPart: "//service.example.com/api/users" },
    can: { namespace: "api", segments: ["read"] }
  }],
  lifetimeInSeconds: 86400, // 24 hours
  facts: [
    { rate_limit: { requests_per_hour: 100, reset_time: "hourly" } }
  ]
});

// Client can verify and use the delegation
const token = ucans.encode(apiAccess);
const result = await ucans.verify(token, {
  audience: clientDid,
  isRevoked: async ucan => false,
  requiredCapabilities: [{
    capability: {
      with: { scheme: "https", hierPart: "//service.example.com/api/users" },
      can: { namespace: "api", segments: ["read"] }
    },
    rootIssuer: serviceKeypair.did()
  }]
});
```

## Real-World Implementation Notes

### Library-Specific APIs

Different UCAN libraries may have different APIs. Here are examples for popular implementations:

#### TypeScript (@ucans/ucans)
```javascript
import * as ucans from "@ucans/ucans"

const keypair = await ucans.EdKeypair.create()
const delegation = await ucans.build({
  audience: "did:key:zabcde...", // recipient DID
  issuer: keypair, // signing key
  capabilities: [{
    with: { scheme: "wnfs", hierPart: "//boris.fission.name/public/photos/" },
    can: { namespace: "wnfs", segments: ["OVERWRITE"] }
  }],
  lifetimeInSeconds: 3600
})
const token = ucans.encode(delegation)
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
- **JavaScript/TypeScript**: [`@ucans/ucans`](https://github.com/ucan-wg/ts-ucan) (NPM: `ucans`)
- **Rust**: [`ucan`](https://github.com/ucan-wg/rs-ucan) 
- **Go**: [`go-ucan`](https://github.com/ucan-wg/go-ucan)
- **Haskell**: [`hs-ucan`](https://github.com/fission-suite/fission)

### Community and Support
- [UCAN Working Group](https://github.com/ucan-wg) - Main GitHub organization
- [Specification Repository](https://github.com/ucan-wg/spec) - Latest specification updates
- [Community Discussions](https://github.com/ucan-wg/spec/discussions) - Ask questions and share ideas

> **Note**: UCAN is an evolving specification. Always refer to the latest version of the specifications and library documentation for the most current information.
