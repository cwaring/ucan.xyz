---
title: "UCAN Library Implementation Guide"
description: "A comprehensive guide for implementing UCAN libraries in different programming languages"
sidebar:
  label: "Implementation Guide"
  order: 1
---

This guide provides detailed instructions and best practices for implementing UCAN (User Controlled Authorization Network) libraries in various programming languages.

> **Note**: This is a living document that will be expanded as more implementation patterns emerge across different languages and ecosystems.

## Overview

Creating a UCAN library involves implementing the core UCAN specification while following language-specific conventions and best practices. This guide will help you build a robust, interoperable UCAN implementation.

### What You'll Build

A complete UCAN library should provide:

- ✅ **Token Creation** - Generate UCAN tokens with proper signatures
- ✅ **Token Validation** - Verify token signatures and capability chains
- ✅ **Capability Management** - Handle resource permissions and delegations
- ✅ **Cryptographic Operations** - Support for EdDSA, ECDSA, and RSA signatures
- ✅ **Serialization** - JWT encoding/decoding with proper headers
- ✅ **Chain Validation** - Verify delegation chains and authority

## Getting Started

### Prerequisites

Before implementing a UCAN library, ensure you have:

1. **Cryptographic Library** - Access to EdDSA, ECDSA, or RSA signature algorithms
2. **JWT Support** - JSON Web Token encoding/decoding capabilities
3. **Base64 Encoding** - URL-safe base64 encoding/decoding
4. **JSON Handling** - Robust JSON parsing and serialization

### Core Components

Every UCAN implementation needs these essential components:

#### 1. UCAN Token Structure

```
// Pseudocode representation
UCANToken {
  header: {
    alg: string,     // Signature algorithm (EdDSA, ES256, RS256)
    typ: "JWT",      // Always "JWT"
    ucv: string      // UCAN version (e.g., "0.10.0")
  },
  payload: {
    iss: string,     // Issuer DID
    aud: string,     // Audience DID
    exp: number,     // Expiration timestamp
    nbf?: number,    // Not before timestamp
    nnc?: string,    // Nonce
    fct: object[],   // Facts
    att: object[],   // Attenuations (capabilities)
    prf: string[]    // Proof chain (parent UCANs)
  },
  signature: string  // Cryptographic signature
}
```

#### 2. Key Management

Implement support for Decentralized Identifiers (DIDs):

- **did:key** - Direct public key encoding
- **did:web** - Web-based DID resolution
- **Custom DID methods** - Extensible for future methods

#### 3. Capability System

Handle UCAN capabilities with proper semantics:

- **Resource URIs** - Unique resource identifiers
- **Ability Sets** - Permitted actions on resources
- **Delegation Rules** - How capabilities can be further delegated

## Implementation Steps

### Step 1: Set Up Project Structure

Create a well-organized project structure:

```
ucan-library/
├── src/
│   ├── core/
│   │   ├── token.{ext}       # UCAN token implementation
│   │   ├── builder.{ext}     # Token builder/creator
│   │   └── validator.{ext}   # Token validation logic
│   ├── crypto/
│   │   ├── keys.{ext}        # Key management
│   │   └── signatures.{ext}  # Signature operations
│   ├── capabilities/
│   │   ├── parser.{ext}      # Capability parsing
│   │   └── validator.{ext}   # Capability validation
│   └── utils/
│       ├── encoding.{ext}    # Base64/JWT utilities
│       └── time.{ext}        # Timestamp handling
├── tests/
├── examples/
└── docs/
```

### Step 2: Implement Core Token Operations

Start with basic token operations:

1. **Token Creation**
   - Generate UCAN tokens with proper headers
   - Sign tokens with provided private keys
   - Handle capability delegations

2. **Token Parsing**
   - Decode JWT tokens
   - Validate token structure
   - Extract capabilities and metadata

3. **Token Validation**
   - Verify cryptographic signatures
   - Check expiration and validity periods
   - Validate capability chains

### Step 3: Add Cryptographic Support

Implement robust cryptographic operations:

- **Key Generation** - Create new key pairs
- **Signature Creation** - Sign UCAN payloads
- **Signature Verification** - Validate existing signatures
- **DID Resolution** - Resolve public keys from DIDs

### Step 4: Capability Handling

Build comprehensive capability management:

- **Capability Parsing** - Extract resources and abilities
- **Delegation Validation** - Ensure proper capability delegation
- **Attenuation Rules** - Handle capability restrictions

### Step 5: Testing & Validation

Ensure your implementation is robust:

- **Unit Tests** - Test individual components
- **Integration Tests** - Test complete workflows
- **Interoperability Tests** - Validate against other implementations
- **Security Tests** - Test attack scenarios

## Best Practices

### Security Considerations

- ✅ **Validate All Inputs** - Never trust external data
- ✅ **Secure Key Storage** - Protect private keys appropriately
- ✅ **Time Validation** - Always check token expiration
- ✅ **Chain Validation** - Verify complete delegation chains
- ✅ **Signature Verification** - Never skip cryptographic validation

### Performance Optimization

- ✅ **Lazy Loading** - Load resources only when needed
- ✅ **Caching** - Cache validated tokens and keys
- ✅ **Async Operations** - Use non-blocking I/O where possible
- ✅ **Memory Management** - Handle large capability chains efficiently

### API Design

- ✅ **Clear Interfaces** - Use intuitive, well-documented APIs
- ✅ **Error Handling** - Provide meaningful error messages
- ✅ **Type Safety** - Use strong typing where available
- ✅ **Immutability** - Prefer immutable data structures

## Language-Specific Considerations

### JavaScript/TypeScript

- Use existing JWT libraries (jose, jsonwebtoken)
- Leverage Web Crypto API for browser compatibility
- Provide both CommonJS and ES modules

### Rust

- Use serde for JSON serialization
- Leverage ring or rustcrypto for cryptography
- Implement zero-copy parsing where possible

### Go

- Use standard crypto packages
- Follow Go conventions for error handling
- Provide clean, idiomatic interfaces

### Python

- Use cryptography library for crypto operations
- Follow PEP 8 style guidelines
- Provide both sync and async APIs

### Swift

- Use CryptoKit for cryptographic operations
- Follow Swift API design guidelines
- Support both iOS and macOS platforms

## Testing Your Implementation

### Interoperability Testing

Test your implementation against other UCAN libraries:

1. **Token Exchange** - Create tokens in one library, validate in another
2. **Capability Delegation** - Test delegation chains across implementations
3. **Signature Compatibility** - Ensure signature algorithms work correctly

### Specification Compliance

Verify your implementation follows the UCAN specification:

- ✅ **Token Format** - Proper JWT structure and claims
- ✅ **Signature Algorithms** - Support required algorithms
- ✅ **Capability Semantics** - Correct capability handling
- ✅ **Delegation Rules** - Proper authority delegation

## Example Implementation

Here's a basic example of creating and validating a UCAN token:

```pseudocode
// Create a new UCAN token
token = UCANBuilder.new()
  .issuer(issuerDID)
  .audience(audienceDID)
  .expiration(futureTimestamp)
  .capability(resource: "https://example.com/photos/*", ability: "read")
  .sign(privateKey)

// Validate the token
validation = UCANValidator.new()
  .validateSignature(token)
  .validateExpiration(token)
  .validateCapabilities(token, requiredCapability)

if validation.isValid() {
  // Token is valid, proceed with operation
} else {
  // Handle validation errors
}
```

## Community & Support

### Getting Help

- 📚 **UCAN Specification** - Review the official specification
- 💬 **Community Forum** - Join discussions with other implementers
- 🐛 **Issue Tracking** - Report bugs and request features
- 📖 **Reference Implementations** - Study existing libraries

### Contributing

Help improve this guide:

- 📝 **Documentation** - Add language-specific examples
- 🧪 **Test Cases** - Contribute interoperability tests
- 🔍 **Best Practices** - Share implementation insights
- 🐛 **Bug Reports** - Report inaccuracies or missing information

## Next Steps

1. **Choose Your Language** - Select the programming language for your implementation
2. **Set Up Development Environment** - Install required dependencies
3. **Study Existing Implementations** - Review reference implementations
4. **Start with Core Features** - Begin with basic token operations
5. **Test Thoroughly** - Ensure compatibility and security
6. **Share with Community** - Contribute your implementation back

---

*This guide is a work in progress. For the latest updates and community contributions, visit our [GitHub repository](https://github.com/ucan-wg).*
