# Dev Wallet Provider

A wallet provider for local development and tests.

# Status

**EARLY PUBLIC ALPHA**

- **Status Last Updated:** May 7th 2020
- **Stable:** No
- **Risk of Breaking Change:** Low

# Usage

- [Install Emulator Flow CLI](https://github.com/onflow/flow/blob/master/docs/cli.md#installation)
- Start Emulator: `flow emulator start --verbose`
- Start Dev-Wallet with `fcl-wallet` from the directory with the `flow.json` file for your emulator.
- Follow instructions provided by `fcl-wallet` to configure `fcl` in your dapp.

```bash
npm install -g @onflow/dev-wallet
fcl-wallet
```

If you have any troubles with this, reach out to us on [Discord](https://discord.gg/k6cZ7QC), we are happy to help.

# Configuration

You can configure the dev-wallet with your projects `flow.json` file.

```json
{
  "accounts": {
    "root": {
      "address": "0000000000000000000000000000000000000001",
      "privateKey": "bf9db4706c2fdb9011ee7e170ccac492f05427b96ab41d8bf2d8c58443704b76",
      "sigAlgorithm": "ECDSA_P256",
      "hashAlgorithm": "SHA3_256"
    }
  },
  "devWallet": {
    "accessNode": {
      "endpoint": "http://localhost:8080"
    },
    "port": 8701
  }
}
```
