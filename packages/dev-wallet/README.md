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
- Pass the root private key from your emulators `flow.json` config as the `PK` environment variable.
- Follow instructions provided by `fcl-wallet` to configure `fcl` in your dapp.

```bash
npm install -g @onflow/dev-wallet
PK=PRIVATE_KEY_FOR_EMULATOR_ROOT_ACCOUNT fcl-wallet
```

If you have any troubles with this, reach out to us on [Discord](https://discord.gg/k6cZ7QC), we are happy to help.
