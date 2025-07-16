# Demo

A lightweight internal demo project for testing FCL and Kit packages during development.

## Purpose

This demo application is designed to:

- Test FCL and Kit packages in a real React environment
- Provide hot reload capabilities for fast development iteration
- Serve as a simple sandbox for testing new features
- Demonstrate integration patterns between FCL and Kit
- Test contract deployment and interaction with Flow emulator

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14+ recommended)
- **Flow CLI** installed ([Installation Guide](https://developers.flow.com/tools/flow-cli/install))
- **npm** or **yarn** package manager

Verify Flow CLI installation:
```bash
flow version
```

## Quick Start

From the root of the repository:

```bash
# Install dependencies (installs all workspace packages)
npm install

# Build packages (required for demo to work)
npm run build

# Start the demo
npm run demo
```

## Flow Emulator & Dev Wallet Setup

### 1. Start Flow Emulator

The Flow emulator simulates the Flow blockchain locally for development and testing.

```bash
# Start the emulator (runs on http://127.0.0.1:3569)
flow emulator
```

**Keep this running in a separate terminal** - the emulator needs to stay active for contract deployment and testing.

### 2. Start Dev Wallet

The dev wallet provides a simple wallet interface for testing on the emulator:

```bash
# Start the dev wallet (runs on http://localhost:8701)
flow dev-wallet
```

**Keep this running in another terminal** - you'll need it for authentication and transaction signing.

### 3. Start the Demo App

```bash
# From the demo directory
npm run dev
```

The app will be available at `http://localhost:5173`

## Development Environments

### Local Development (Emulator)

```bash
# Terminal 1: Start emulator
flow emulator

# Terminal 2: Start dev wallet  
flow dev-wallet

# Terminal 3: Start app
cd packages/demo
npm run dev
```

**Configuration**: Uses `emulator-account` (address: `f8d6e0586b0a20c7`)

### Testnet Development

```bash
# Run against deployed contracts on Flow Testnet
npm run dev:testnet
```

**Note**: Requires Flow Wallet.

## Features Provided

- `@onflow/react-sdk` setup and configuration
- Wallet Discovery (including Dev Wallet on Emulator)
- CLI private key separation for security
- Flow.json loading for contract placeholders
- Authentication
- CDC file loader
- Custom hooks
- Interaction examples

## What You Can Test

### Authentication

- Connect/disconnect wallet
- View user profile information
- Test authentication state management

### Contract Interaction

- **Execute scripts** to read contract state
- **Send transactions** to modify contract state

### Queries

- Execute Cadence scripts
- Test data fetching and caching
- Debug query responses

### Transactions

- Send transactions to the blockchain
- Monitor transaction status
- Test error handling
- Sign transactions with dev wallet

## Package Dependencies

This demo uses workspace references to:

- `@onflow/fcl` - Core Flow Client Library
- `@onflow/react-sdk` - React hooks for Flow
- `@onflow/typedefs` - Type definitions

Changes to these packages are immediately available via workspace symlinks.
