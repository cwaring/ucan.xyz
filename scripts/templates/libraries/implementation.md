---
title: "UCAN Library Implementation Guide"
description: "A comprehensive guide for implementing UCAN libraries in different programming languages"
---

This guide provides detailed instructions and best practices for implementing UCAN (User Controlled Authorization Network) libraries in various programming languages based on the UCAN v1.0.0-rc.1 specification.

> **Important**: This guide reflects the UCAN v1.0.0-rc.1 specification. UCAN v1.0 introduces significant changes from earlier versions, including a new envelope format and restructured payload fields. Always refer to the latest specifications for implementation details.

## Overview

Creating a UCAN library involves implementing the core UCAN specification while following language-specific conventions and best practices. This guide will help you build a robust, interoperable UCAN implementation.

### Major Changes in UCAN v1.0

UCAN v1.0 introduces significant changes from earlier versions:

- **Envelope Format**: Replaces JWT-based tokens with UCAN-specific envelope format
- **Type Tags**: Each UCAN type has a specific tag (e.g., `ucan/dlg@1.0.0-rc.1` for delegations)
- **Structured Capabilities**: Capabilities are now structured with subject, command, and policy
- **Policy Language**: Introduces a comprehensive policy language for expressing constraints
- **Separate Specifications**: Delegation, Invocation, Promise, and Revocation are separate specs
- **IPLD/CBOR Encoding**: Uses IPLD and CBOR instead of JSON for better efficiency

### What You'll Build

A complete UCAN library should provide:

- ✅ **Delegation Creation** - Generate UCAN delegation tokens with proper envelope format
- ✅ **Delegation Validation** - Verify delegation signatures and capability chains  
- ✅ **Invocation Creation** - Create invocation tokens to exercise delegated capabilities
- ✅ **Capability Management** - Handle capability parsing, validation, and policy checking
- ✅ **Cryptographic Operations** - Support for signature algorithms (EdDSA, ECDSA, RSA)
- ✅ **Envelope Handling** - UCAN envelope encoding/decoding with proper type tags
- ✅ **Chain Validation** - Verify delegation chains and authority propagation

## Getting Started

### Prerequisites

Before implementing a UCAN library, ensure you have:

1. **Cryptographic Library** - Access to EdDSA, ECDSA, or RSA signature algorithms
2. **UCAN Envelope Support** - Ability to handle UCAN envelope format (not traditional JWT)
3. **IPLD/CBOR Support** - For encoding/decoding UCAN envelopes and payloads
4. **Base64 Encoding** - URL-safe base64 encoding/decoding for envelope serialization
5. **JSON Handling** - Robust JSON parsing for policy language and metadata

### Core Components

Every UCAN implementation needs these essential components:

#### 1. UCAN Envelope Structure

UCAN v1.0 uses an envelope format rather than traditional JWT. Each UCAN type has its own envelope structure:

```
// UCAN Delegation Envelope
UCANDelegation {
  envelope: {
    tag: "ucan/dlg@1.0.0-rc.1",  // Type tag for delegation
    // envelope-specific fields
  },
  payload: {
    iss: DID,        // Issuer DID
    aud: DID,        // Audience DID  
    sub: DID | null, // Subject DID (delegation chain principal)
    cmd: String,     // Command to eventually invoke
    pol: Policy,     // Policy constraints (UCAN Policy Language)
    nonce: Bytes,    // Cryptographic nonce
    meta?: Object,   // Optional metadata (not delegated)
    nbf?: Integer,   // Not before timestamp (optional)
    exp: Integer | null // Expiration timestamp (required)
  },
  signature: Bytes   // Cryptographic signature
}

// UCAN Invocation Envelope  
UCANInvocation {
  envelope: {
    tag: "ucan/inv@1.0.0-rc.1",  // Type tag for invocation
    // envelope-specific fields
  },
  payload: {
    // Invocation-specific payload structure
    // (see UCAN Invocation specification)
  },
  signature: Bytes
}
```

#### 2. Key Management

Implement support for Decentralized Identifiers (DIDs):

- **did:key** - Direct public key encoding
- **did:web** - Web-based DID resolution
- **Custom DID methods** - Extensible for future methods

#### 3. UCAN Policy Language

UCAN v1.0 uses a sophisticated policy language for expressing capability constraints:

```
// Policy examples
Policy = [
  ["==", ".status", "draft"],                    // Equality check
  [">=", ".size", 1024],                        // Numeric comparison  
  ["like", ".email", "*@example.com"],          // Glob pattern matching
  ["all", ".reviewers", ["like", ".email", "*@corp.com"]], // Quantification
  ["and", [                                     // Logical conjunction
    ["!=", ".type", "sensitive"],
    ["or", [["==", ".dept", "eng"], ["==", ".dept", "design"]]]
  ]]
]
```

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

### Step 2: Implement Core UCAN Operations

Start with basic UCAN operations following the v1.0 specification:

1. **Delegation Creation**
   - Generate UCAN delegation envelopes with proper type tags
   - Implement delegation payload structure with required fields
   - Sign delegations with issuer private keys
   - Handle capability delegation chains

2. **Envelope Parsing**
   - Decode UCAN envelopes (not JWT format)
   - Validate envelope structure and type tags
   - Extract capabilities and policy constraints
   - Parse delegation chains and proof references

3. **Delegation Validation**
   - Verify cryptographic signatures using envelope format
   - Check expiration and validity periods (nbf/exp)
   - Validate capability chains and authority delegation
   - Evaluate policy constraints using UCAN Policy Language

### Step 3: Add Cryptographic Support

Implement robust cryptographic operations:

- **Key Generation** - Create new key pairs
- **Signature Creation** - Sign UCAN payloads
- **Signature Verification** - Validate existing signatures
- **DID Resolution** - Resolve public keys from DIDs

### Step 4: Policy Language Implementation

Build comprehensive policy evaluation:

- **Policy Parsing** - Parse UCAN Policy Language expressions
- **Selector Resolution** - Implement JSONPath-like selectors (e.g., ".field.subfield")
- **Comparison Operators** - Support ==, !=, <, <=, >, >=, like
- **Logical Connectives** - Implement and, or, not operations
- **Quantifiers** - Handle all/any quantification over collections
- **Glob Matching** - Support wildcard patterns for string matching

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

- Use IPLD/CBOR libraries for envelope encoding (e.g., @ipld/dag-cbor)
- Leverage existing cryptographic libraries (noble-ed25519, noble-secp256k1)
- Implement UCAN Policy Language evaluation
- Support both browser and Node.js environments

### Rust

- Use serde for serialization with CBOR support (serde_cbor)
- Leverage libipld for IPLD handling
- Use ring or rustcrypto for cryptographic operations
- Implement zero-copy parsing where possible for performance

### Go

- Use CBOR libraries for envelope encoding (github.com/fxamacker/cbor)
- Follow Go conventions for error handling and interfaces
- Implement clean, idiomatic UCAN envelope parsing
- Support concurrent validation where appropriate

### Python

- Use cbor2 for CBOR encoding/decoding
- Use cryptography library for crypto operations
- Implement async support for Policy Language evaluation
- Follow PEP 8 style guidelines and type hints

### Swift

- Use CryptoKit for cryptographic operations
- Implement CBOR encoding/decoding for envelopes
- Follow Swift API design guidelines for UCAN types
- Support both iOS and macOS platforms with proper error handling

## Testing Your Implementation

### Interoperability Testing

Test your implementation against other UCAN v1.0 libraries:

1. **Envelope Exchange** - Create envelopes in one library, validate in another
2. **Delegation Chains** - Test delegation chains across implementations  
3. **Policy Evaluation** - Ensure consistent policy language evaluation
4. **Signature Compatibility** - Verify signature algorithms work correctly
5. **Type Tag Handling** - Test proper envelope type tag recognition

### Specification Compliance

Verify your implementation follows the UCAN v1.0.0-rc.1 specification:

- ✅ **Envelope Format** - Proper UCAN envelope structure with type tags
- ✅ **Delegation Payload** - Correct delegation payload fields (iss, aud, sub, cmd, pol, etc.)
- ✅ **Policy Language** - Full UCAN Policy Language support
- ✅ **Signature Algorithms** - Support required cryptographic algorithms
- ✅ **Type Tags** - Proper envelope type tags (ucan/dlg@1.0.0-rc.1, etc.)
- ✅ **Chain Validation** - Verify delegation chains and capability propagation

## Example Implementation

Here's a basic example of creating and validating a UCAN delegation:

```pseudocode
// Create a new UCAN delegation
delegation = UCANDelegation.builder()
  .envelope_tag("ucan/dlg@1.0.0-rc.1")
  .issuer(issuerDID)
  .audience(audienceDID)  
  .subject(subjectDID)
  .command("/blog/post/create")
  .policy([
    ["==", ".status", "draft"],
    ["like", ".author", "*@example.com"]
  ])
  .expiration(futureTimestamp)
  .nonce(randomBytes(32))
  .sign(privateKey)

// Validate the delegation
validation = UCANValidator.new()
  .validateEnvelope(delegation)
  .validateSignature(delegation) 
  .validateExpiration(delegation)
  .validatePolicy(delegation, invocationArgs)

if validation.isValid() {
  // Delegation is valid, can be used for invocation
} else {
  // Handle validation errors
}

// Create an invocation using the delegation
invocation = UCANInvocation.builder()
  .envelope_tag("ucan/inv@1.0.0-rc.1")
  .capability(delegation)
  .arguments({
    "status": "draft",
    "author": "alice@example.com",
    "title": "New Blog Post"
  })
  .sign(audiencePrivateKey)
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

1. **Study the v1.0 Specifications** - Read the UCAN Delegation and Invocation specifications thoroughly
2. **Choose Your Language** - Select the programming language for your implementation
3. **Set Up IPLD/CBOR Support** - Install required dependencies for envelope handling
4. **Implement Envelope Parsing** - Start with basic envelope encoding/decoding
5. **Add Policy Language Support** - Implement the UCAN Policy Language evaluator
6. **Test Against Reference Implementations** - Ensure compatibility and correctness
7. **Contribute to the Ecosystem** - Share your implementation with the UCAN community

---

*This guide reflects the UCAN v1.0.0-rc.1 specification. For the latest updates and community contributions, visit the [UCAN Working Group](https://github.com/ucan-wg) repositories.*
