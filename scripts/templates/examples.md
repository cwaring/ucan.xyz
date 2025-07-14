---
title: "UCAN Examples"
description: "Practical examples of using UCAN for authorization and delegation"
sidebar:
  label: "Examples"
  order: 2
---

This page contains practical examples of using UCAN for various authorization scenarios.

> **Note**: These examples show the conceptual structure and high-level API patterns. Actual implementations may vary depending on the UCAN library you're using. Refer to the specific library documentation for exact API details.

## Example 1: File System Access

### Scenario
Alice wants to give Bob temporary read access to a specific file.

### UCAN Delegation Structure

```javascript
// UCAN Delegation (conceptual structure)
const delegation = {
  // Standard JWT header
  header: {
    alg: "EdDSA",
    typ: "JWT",
    uav: "1.0.0" // UCAN version
  },
  
  // UCAN payload
  payload: {
    iss: "did:key:z6Mkv...", // Alice's DID (issuer)
    aud: "did:key:z6Mk3...", // Bob's DID (audience)
    sub: "did:key:z6Mkv...", // Subject (Alice owns the resource)
    cap: [{                  // Capabilities array
      sub: "did:key:z6Mkv...", // Resource subject
      cmd: "/fs/read",          // Command
      pol: [                    // Policy constraints
        ["==", ".path", "file:///alice/documents/report.pdf"],
        ["<", ".size", 1048576] // Max 1MB
      ]
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
// Using a UCAN library (pseudocode)
import { Agent } from '@ucan/core';

// Alice creates and signs the delegation
const alice = new Agent({ privateKey: alicePrivateKey });
const bob = new Agent({ privateKey: bobPrivateKey });

const delegation = await alice.delegate({
  audience: bob.did(),
  capabilities: [{
    resource: "file:///alice/documents/report.pdf",
    ability: "read",
    constraints: {
      maxSize: 1048576 // 1MB limit
    }
  }],
  expiration: new Date(Date.now() + 3600000), // 1 hour
  facts: []
});

// Bob receives the delegation and uses it to access the file
const result = await bob.invoke({
  capability: delegation.capabilities[0],
  arguments: {
    path: "file:///alice/documents/report.pdf"
  },
  proofs: [delegation]
});
```

## Example 2: API Rate Limiting

### Scenario
A service wants to delegate API access with rate limiting constraints.

### UCAN Delegation Structure

```javascript
// API access delegation with rate limiting
const apiDelegation = {
  header: {
    alg: "EdDSA",
    typ: "JWT",
    uav: "1.0.0"
  },
  payload: {
    iss: "did:key:z6Mkservice...", // Service DID
    aud: "did:key:z6Mkclient...",  // Client DID
    sub: "did:key:z6Mkservice...", // Service owns the API
    cap: [{
      sub: "did:key:z6Mkservice...",
      cmd: "/api/users/read",
      pol: [
        ["<=", ".requests_per_hour", 100],
        ["==", ".scope", "public"],
        ["like", ".endpoint", "/api/users/*"] // Restrict to user endpoints
      ]
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
// Service delegates API access
const service = new Agent({ privateKey: servicePrivateKey });
const client = new Agent({ privateKey: clientPrivateKey });

const apiAccess = await service.delegate({
  audience: client.did(),
  capabilities: [{
    resource: "api://service.example.com/users",
    ability: "read",
    constraints: {
      requests_per_hour: 100,
      scope: "public"
    }
  }],
  expiration: new Date(Date.now() + 86400000), // 24 hours
  facts: [
    { rate_limit: { requests_per_hour: 100, reset_time: "hourly" } }
  ]
});

// Client invokes the API capability
const response = await client.invoke({
  capability: apiAccess.capabilities[0],
  arguments: {
    endpoint: "/api/users/123",
    method: "GET"
  },
  proofs: [apiAccess]
});
```

## Real-World Implementation Notes

### Library-Specific APIs

Different UCAN libraries may have different APIs. Here are examples for popular implementations:

#### TypeScript (@ucan/core)
```javascript
import { AgentData } from '@ucan/core';

const agent = await AgentData.create();
const delegation = await agent.delegate({
  audience: recipientDid,
  capabilities: [{ can: 'store/add', with: agent.did() }],
  expiration: Infinity
});
```

#### Rust (ucan-rs)
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
   { resource: "file:///alice/documents/report.pdf", ability: "read" }
   
   // Avoid: Overly broad permissions  
   { resource: "file:///alice/*", ability: "*" }
   ```

2. **Short Expiry Times**: Use the shortest practical expiration times
   ```javascript
   // Good: Short-lived for temporary access
   expiration: new Date(Date.now() + 3600000) // 1 hour
   
   // Good: Longer for trusted devices
   expiration: new Date(Date.now() + 2592000000) // 30 days
   
   // Avoid: No expiration unless absolutely necessary
   expiration: null // Never expires
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
- **JavaScript/TypeScript**: [`@ucan/core`](https://github.com/ucan-wg/ts-ucan)
- **Rust**: [`ucan`](https://github.com/ucan-wg/rs-ucan) 
- **Go**: [`go-ucan`](https://github.com/ucan-wg/go-ucan)
- **Haskell**: [`hs-ucan`](https://github.com/fission-suite/fission)

### Community and Support
- [UCAN Working Group](https://github.com/ucan-wg) - Main GitHub organization
- [Specification Repository](https://github.com/ucan-wg/spec) - Latest specification updates
- [Community Discussions](https://github.com/ucan-wg/spec/discussions) - Ask questions and share ideas

> **Note**: UCAN is an evolving specification. Always refer to the latest version of the specifications and library documentation for the most current information.
