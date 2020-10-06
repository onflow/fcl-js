# Flow Client Library Demo
This project demonstrates how to use FCL in your webapp and interact with Flow and wallet providers.
You can find an online demo [Here](http://fcl-demo.portto.io/) 

## Getting Started

### Setting up environment 
In order for this demo to work, you have to setup the dependencies first:

- **Install Flow CLI** [Here](https://github.com/onflow/flow/blob/master/docs/cli.md)  
The Flow CLI is a command-line interface that provides useful utilities for building Flow applications. The tool we need in this demo is *Flow emulator*, a local emulator of Flow blockchain.
- **Install project dependencies**  
Run `yarn` at project root.

### Starting the services
- **Start Flow emulator**  
Run `flow emulator start` at project root. Flow CLI uses `./flow.json` as config to start up the local Flow emulator.  
The emulator provides a local access node at `http://localhost:8080`
- **Start FCL dev-wallet**  
Run `yarn run dev-wallet` at project root, which starts FCL dev wallet with private key identical to the one defined in `./flow.json`.  
The dev wallet is served at `http://localhost:8701`
- **Start demo webapp**  
Run `yarn start` at project root and you will see the demo webapp running at `http://localhost:3000`

## Diving into Demo
All the demo cases are located in `./src/demo`. Each component is responsible for one example interaction with FCL. 

- **GetLatestBlock**: Get the information of the latest block produced on Flow blockchain
- **GetAccount**: Get the account information for any specified account address
- **ScriptOne**: Executes a simple script (read-only)
- **ScriptTwo**: Executes a simple script (read-only) but with custom decoder for custom Cadence data structure
- **Authenticate**: Handles sign in/out logic with FCL wallet
- **UserInfo**: Subscribes to `fcl.currentUser()` and shows the connected user account information 
- **SendTransaction**: Sends a simple transaction to Flow. This requires the signatures from the connected user
- **DeployContract**: Deploys a contract to the current user's code storage
- **InteractWithContract**: Sends a simple transaction that executes a contract method. This requires the signatures from the connected user

## Switch to Testnet (devnet-9)
You can also test on Flow testnet instead of local emulator. To do so, simply update the FCL config inside `./src/config.js`:
```
fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("challenge.handshake", "https://flow-wallet-staging.blocto.app/authn")
```
This will use a testnet access node instead of local emulator, and *Blocto testnet wallet* instead of local dev-wallet.

## Contact
If you encounter any questions while trying out Flow, please go to [Flow Discord Server](https://discord.gg/SEJtd32), where you can find other developers to help you out.  
If you have any problem integrating Blocto wallet, you can also check out [Blocto Discord Server](https://discord.gg/Y2sfssn)

## Acknowledgement
- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- A lot of the examples were taken from the tutorial in [FCL](https://github.com/onflow/flow-js-sdk/tree/master/packages/fcl)
