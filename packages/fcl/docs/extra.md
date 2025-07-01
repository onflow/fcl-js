## Configuration

FCL has a mechanism that lets you configure various aspects of FCL. When you move from one instance of the Flow Blockchain to another (Local Emulator to Testnet to Mainnet) the only thing you should need to change for your FCL implementation is your configuration.

### Setting Configuration Values

Values only need to be set once. We recommend doing this once and as early in the life cycle as possible. To set a configuration value, the `put` method on the `config` instance needs to be called, the `put` method returns the `config` instance so they can be chained.

Alternatively, you can set the config by passing a JSON object directly.

```javascript
import * as fcl from '@onflow/fcl';

fcl
  .config() // returns the config instance
  .put('foo', 'bar') // configures "foo" to be "bar"
  .put('baz', 'buz'); // configures "baz" to be "buz"

// OR

fcl.config({
  foo: 'bar',
  baz: 'buz',
});
```

### Getting Configuration Values

The `config` instance has an **asynchronous** `get` method. You can also pass it a fallback value.

```javascript
import * as fcl from '@onflow/fcl';

fcl.config().put('foo', 'bar').put('woot', 5).put('rawr', 7);

const FALLBACK = 1;

async function addStuff() {
  var woot = await fcl.config().get('woot', FALLBACK); // will be 5 -- set in the config before
  var rawr = await fcl.config().get('rawr', FALLBACK); // will be 7 -- set in the config before
  var hmmm = await fcl.config().get('hmmm', FALLBACK); // will be 1 -- uses fallback because this isnt in the config

  return woot + rawr + hmmm;
}

addStuff().then((d) => console.log(d)); // 13 (5 + 7 + 1)
```

### Common Configuration Keys

| Name                                 | Example                                                       | Description                                                                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessNode.api` **(required)**      | `https://rest-testnet.onflow.org`                             | API URL for the Flow Blockchain Access Node you want to be communicating with. See all available access node endpoints [here](https://developers.onflow.org/http-api/). |
| `app.detail.title`                   | `Cryptokitties`                                               | Your applications title, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                       |
| `app.detail.icon`                    | `https://fcl-discovery.onflow.org/images/blocto.png`          | Url for your applications icon, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                |
| `app.detail.description`             | `Cryptokitties is a blockchain game`                          | Your applications description, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                 |
| `app.detail.url`                     | `https://cryptokitties.co`                                    | Your applications url, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                         |
| `challenge.handshake`                | **DEPRECATED**                                                | Use `discovery.wallet` instead.                                                                                                                                         |
| `discovery.authn.endpoint`           | `https://fcl-discovery.onflow.org/api/testnet/authn`          | Endpoint for alternative configurable Wallet Discovery mechanism.                                                                  |
| `discovery.wallet` **(required)**    | `https://fcl-discovery.onflow.org/testnet/authn`              | Points FCL at the Wallet or Wallet Discovery mechanism.                                                                                                                 |
| `discovery.wallet.method`            | `IFRAME/RPC`, `POP/RPC`, `TAB/RPC`, `HTTP/POST`, or `EXT/RPC` | Describes which service strategy a wallet should use.                                                                                                                   |
| `fcl.limit`                          | `100`                                                         | Specifies fallback compute limit if not provided in transaction. Provided as integer.                                                                                   |
| `flow.network` **(recommended)**     | `testnet`                                                     | Used in conjunction with stored interactions and provides FCLCryptoContract address for `testnet` and `mainnet`. Possible values: `local`, `testnet`, `mainnet`.        |
| `walletconnect.projectId`            | `YOUR_PROJECT_ID`                                             | Your app's WalletConnect project ID. See [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) to obtain a project ID for your application.                    |
| `walletconnect.disableNotifications` | `false`                                                       | Optional flag to disable pending WalletConnect request notifications within the application's UI.                                                                       |

## Using Contracts in Scripts and Transactions

### Address Replacement

Configuration keys that start with `0x` will be replaced in FCL scripts and transactions, this allows you to write your script or transaction Cadence code once and not have to change it when you point your application at a difference instance of the Flow Blockchain.

```javascript
import * as fcl from '@onflow/fcl';

fcl.config().put('0xFungibleToken', '0xf233dcee88fe0abe');

async function myScript() {
  return fcl
    .send([
      fcl.script`
      import FungibleToken from 0xFungibleToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

      access(all) fun main() { /* Rest of the script goes here */ }
    `,
    ])
    .then(fcl.decode);
}

async function myTransaction() {
  return fcl
    .send([
      fcl.transaction`
      import FungibleToken from 0xFungibleToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

      transaction { /* Rest of the transaction goes here */ }
    `,
    ])
    .then(fcl.decode);
}
```

#### Example

```javascript
import * as fcl from '@onflow/fcl';

fcl
  .config()
  .put('flow.network', 'testnet')
  .put('walletconnect.projectId', 'YOUR_PROJECT_ID')
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
  .put('app.detail.title', 'Test Harness')
  .put('app.detail.icon', 'https://i.imgur.com/r23Zhvu.png')
  .put('app.detail.description', 'A test harness for FCL')
  .put('app.detail.url', 'https://myapp.com')
  .put('service.OpenID.scopes', 'email email_verified name zoneinfo')
  .put('0xFlowToken', '0x7e60df042a9c0868');
```

### Using `flow.json` for Contract Imports

A simpler and more flexible way to manage contract imports in scripts and transactions is by using the `config.load` method in FCL. This lets you load contract configurations from a `flow.json` file, keeping your import syntax clean and allowing FCL to pick the correct contract addresses based on the network you're using.

#### 1. Define Your Contracts in `flow.json`

Here’s an example of a `flow.json` file with aliases for multiple networks:

```json
{
  "contracts": {
    "HelloWorld": {
      "source": "./cadence/contracts/HelloWorld.cdc",
      "aliases": {
        "testnet": "0x1cf0e2f2f715450",
        "mainnet": "0xf8d6e0586b0a20c7"
      }
    }
  }
}
```

- **`source`**: Points to the contract file in your project.
- **`aliases`**: Maps each network to the correct contract address.

#### 2. Configure FCL

Load the `flow.json` file and set up FCL to use it:

```javascript
import { config } from '@onflow/fcl';
import flowJSON from '../flow.json';

config({
  'flow.network': 'testnet', // Choose your network, e.g., testnet or mainnet
  'accessNode.api': 'https://rest-testnet.onflow.org', // Access node for the network
  'discovery.wallet': `https://fcl-discovery.onflow.org/testnet/authn`, // Wallet discovery
}).load({ flowJSON });
```

With this setup, FCL will automatically use the correct contract address based on the selected network (e.g., `testnet` or `mainnet`).

#### 3. Use Contract Names in Scripts and Transactions

After setting up `flow.json`, you can import contracts by name in your Cadence scripts or transactions:

```cadence
import "HelloWorld"

access(all) fun main(): String {
    return HelloWorld.sayHello()
}
```

FCL replaces `"HelloWorld"` with the correct address from the `flow.json` configuration.

> **Note**: Don’t store private keys in your `flow.json`. Instead, keep sensitive keys in a separate, `.gitignore`-protected file.