# Flow Client Library (FCL) API Reference

**Version**: 0.73.0

**Last Updated**: July 20, 2021

# Table of contents

- [Flow Client Library (FCL) API Reference](#flow-client-library-fcl-api-reference)
- [Configuration](#configuration)
  - [Setting Configuration Values](#setting-configuration-values)
  - [Getting Configuration Values](#getting-configuration-values)
  - [Common Configuration Keys](#common-configuration-keys)
  - [Address replacement in scripts and transactions](#address-replacement-in-scripts-and-transactions)
  - [Example](#example)
- [Wallet Interactions](#wallet-interactions)
  - [`fcl.authenticate()`](#fclauthenticate)
  - [`fcl.unauthenticate()`](#fclunauthenticate)
  - [`fcl.reauthenticate()`](#fclreauthenticate)
  - [`fcl.signUp()`](#fclsignup)
  - [`fcl.login()`](#fcllogin)
  - [`fcl.authz`](#fclauthz)
  - [Current User](#current-user)
  - [`fcl.currentUser().subscribe(callback)`](#fclcurrentusersubscribecallback)
  - [`fcl.currentUser().snapshot()`](#fclcurrentusersnapshot)
  - [`fcl.currentUser().authenticate()`](#fclcurrentuserauthenticate)
  - [`fcl.currentUser().unauthenticate()`](#fclcurrentuserunauthenticate)
  - [`fcl.currentUser().authorization()`](#fclcurrentuserauthorization)
- [On-chain Interactions](#on-chain-interactions)
  - [Query and Mutate Flow with Cadence](#query-and-mutate-flow-with-cadence)
  - [`fcl.query({...options})`](#fclqueryoptions)
  - [`fcl.mutate({...options})`](#fclmutateoptions)
  - [Query and mutate the blockchain with Builders](#query-and-mutate-the-blockchain-with-builders)
  - [`fcl.send([...builders])`](#fclsendbuilders)
  - [`fcl.decode(response)`](#fcldecoderesponse)
  - [Builders](#builders)
  - [Query Builders](#query-builders)
  - [`fcl.getAccount(address)`](#fclgetaccountaddress)
  - [`fcl.getBlock(isSealed)`](#fclgetblockissealed)
  - [`fcl.atBlockHeight(blockHeight)`](#fclatblockheightblockheight)
  - [`fcl.atBlockId(blockId)`](#fclatblockidblockid)
  - [`fcl.getBlockHeader()`](#fclgetblockheader)
  - [`fcl.getEventsAtBlockHeightRange(eventName,fromBlockHeight,toBlockHeight)`](#fclgeteventsatblockheightrangeeventnamefromblockheighttoblockheight)
  - [`fcl.getEventsAtBlockIds(eventName,[...blockIds])`](#fclgeteventsatblockidseventnameblockids)
  - [`fcl.getCollection(collectionID)`](#fclgetcollectioncollectionid)
  - [`fcl.getTransactionStatus(transactionId)`](#fclgettransactionstatustransactionid)
  - [`fcl.getTransaction(transactionId)`](#fclgettransactiontransactionid)
  - [`fcl.getEvents(eventName,fromBlock,toBlock)` - Deprecated](#fclgeteventseventnamefromblocktoblock---deprecated)
  - [`fcl.getLatestBlock(isSealed)` - Deprecated](#fclgetlatestblockissealed---deprecated)
  - [`fcl.getBlockById(blockId)` - Deprecated](#fclgetblockbyidblockid---deprecated)
  - [`fcl.getBlockByHeight(blockHeight)` - Deprecated](#fclgetblockbyheightblockheight---deprecated)
  - [Utility Builders](#utility-builders)
  - [`fcl.arg(value, type)`](#fclargvalue-type)
  - [`fcl.args([...args])`](#fclargsargs)
  - [Template Builders](#template-builders)
  - [`fcl.script(CODE)`](#fclscriptcode)
  - [`fcl.transaction(CODE)`](#fcltransactioncode)
  - [Pre-built Interactions](#pre-built-interactions)
  - [`fcl.account(address)`](#fclaccountaddress)
  - [`fcl.latestBlock(isSealed)`](#fcllatestblockissealed)
  - [Transaction Status Utility](#transaction-status-utility)
  - [`fcl.tx(transactionId)`](#fcltxtransactionid)
  - [Event Polling Utility](#event-polling-utility)
  - [`fcl.events(eventName)`](#fcleventseventname)
- [Types, Interfaces, and Definitions](#types-interfaces-and-definitions)
  - [`Builders`](#builders)
  - [`Interaction`](#interaction)
  - [`CurrentUserObject`](#currentuserobject)
  - [`AuthorizationObject`](#authorizationobject)
  - [`SignableObject`](#signableobject)
  - [`AccountObject`](#accountobject)
  - [`Address`](#address)
  - [`ArgumentObject`](#argumentobject)
  - [`ArgumentFunction`](#argumentfunction)
  - [`Authorization Function`](#authorization-function)
  - [`Signing Function`](#signing-function)
  - [`TransactionRolesObject`](#transactionrolesobject)
  - [`EventName`](#eventname)
  - [`Contract`](#contract)
  - [`KeyObject`](#keyobject)
  - [`BlockObject`](#blockobject)
  - [`BlockHeaderObject`](#blockheaderobject)
  - [`CollectionGuaranteeObject`](#collectionguaranteeobject)
  - [`CollectionObject`](#collectionobject)
  - [`ResponseObject`](#responseobject)
  - [`Event Object`](#event-object)
  - [`Transaction Statuses`](#transaction-statuses)
  - [`GRPC Statuses`](#grpc-statuses)
  - [`FType`](#ftype)

# Configuration

FCL has a mechanism that lets you configure various aspects of FCL. When you move from one instance of the Flow Blockchain to another (Local Emulator to Testnet to Mainnet) the only thing you should need to change for your FCL implementation is your configuration.

---

## Setting Configuration Values

Values only need to be set once. We recommend doing this once and as early in the life cycle as possible. To set a configuration value, the `put` method on the `config` instance needs to be called, the `put` method returns the `config` instance so they can be chained.

Alternatively, you can set the config by passing a JSON object directly.

```javascript
import * as fcl from "@onflow/fcl";

fcl
  .config() // returns the config instance
  .put("foo", "bar") // configures "foo" to be "bar"
  .put("baz", "buz"); // configures "baz" to be "buz"

// OR

fcl.config({
  foo: "bar",
  baz: "buz",
});
```

## Getting Configuration Values

The `config` instance has an **asynchronous** `get` method. You can also pass it a fallback value.

```javascript
import * as fcl from "@onflow/fcl";

fcl.config().put("foo", "bar").put("woot", 5).put("rawr", 7);

const FALLBACK = 1;

async function addStuff() {
  var woot = await fcl.config().get("woot", FALLBACK); // will be 5 -- set in the config before
  var rawr = await fcl.config().get("rawr", FALLBACK); // will be 7 -- set in the config before
  var hmmm = await fcl.config().get("hmmm", FALLBACK); // will be 1 -- uses fallback because this isnt in the config

  return woot + rawr + hmmm;
}

addStuff().then((d) => console.log(d)); // 13 (5 + 7 + 1)
```

## Common Configuration Keys

| Name                            | Example                                              | Description                                                                                                                                                                                    |
| ------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessNode.api` **(required)** | `https://access-testnet.onflow.org`                  | API URL for the Flow Blockchain Access Node you want to be communicating with. See all available access node endpoints [here](https://docs.onflow.org/access-api/#flow-access-node-endpoints). |
| `env`                           | `testnet`                                            | Used in conjunction with stored interactions. Possible values: `local`, `canarynet`, `testnet`, `mainnet`                                                                                      |
| `discovery.wallet`              | `https://fcl-discovery.onflow.org/testnet/authn`     | Points FCL at the Wallet or Wallet Discovery mechanism.                                                                                                                                        |
| `app.detail.title`              | `Cryptokitties`                                      | Your applications title, can be requested by wallets and other services.                                                                                                                       |
| `app.detail.icon`               | `https://fcl-discovery.onflow.org/images/blocto.png` | Url for your applications icon, can be requested by wallets and other services.                                                                                                                |
| `challenge.handshake`           | **DEPRECATED**                                       | Use `discovery.wallet` instead.                                                                                                                                                                |

## Address replacement in scripts and transactions

Configuration keys that start with `0x` will be used to find-and-replace their values in Cadence scripts and transactions input to FCL. Typically this is used to represent account addresses. Account addresses for the same contract will be different depending on the Flow network you're interacting with (eg. Testnet, Mainnet).
This allows you to write your script or transaction once and not have to update code when you point your application at a different Flow network.

```javascript
import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("0xFlowToken", "0x7e60df042a9c0868");

async function myScript() {
  return fcl.query({
    cadence: `
        import FlowToken from 0xFlowToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

        pub fun main(): UFix64 { 
          return FlowToken.totalSupply  // arbitrary script that can access FlowToken interface
        }
      `,
  });
}
```

## Example

```javascript
import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("env", "testnet")
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://i.imgur.com/r23Zhvu.png")
  .put("0xFlowToken", "0x7e60df042a9c0868");
```

---

# Wallet Interactions

These methods allows dapps to interact with FCL compatible wallets in order to authenticate the user and authorize transactions on their behalf.

> :warning: These methods are **async**.

## Methods

---

## `fcl.authenticate()`

> :warning: **This method can only be used in web browsers.**

Calling this method will authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `discovery.wallet` endpoint which lets the user select a wallet to authenticate with. Once the wallet provider has authenticated the user, FCL will set the values on the [current user](#CurrentUserObject) object for future use and authorization.

### Note

:warning: `discovery.wallet` value **must** be set in the configuration before calling this method. See [FCL Configuration](#Configuration).

:loudspeaker: The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
fcl
  .config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
// anywhere on the page
fcl.authenticate();
```

### Examples

- [Press Login: Live Kitty Items](http://kitty-items-flow-testnet.herokuapp.com/)

---

## `fcl.unauthenticate()`

> :warning: **This method can only be used in web browsers.**

Logs out the current user and sets the values on the [current user](#`CurrentUserObject`) object to null.

### Note

:warning: The current user must be authenticated first.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
fcl.config().put("accessNode.api", "https://access-testnet.onflow.org");
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.unauthenticate();
// fcl.currentUser().loggedIn === null
```

### Examples

- [React Hook to manage FCL authentication: Kitty-items](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.reauthenticate()`

> :warning: **This method can only be used in web browsers.**

A **convenience method** that calls [`fcl.unauthenticate()`](<#fcl.unauthenticate()>) and then [`fcl.authenticate()`](<#fcl.authenticate()>) for the current user.

### Note

:warning: The current user must be authenticated first.

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.reauthenticate();
// logs out user and opens up login/sign-up flow
```

### Examples

- [React Hook to manage FCL authentication: Kitty-items](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.signUp()`

> :warning: **This method can only be used in web browsers.**

A **convenience method** that calls and is equivalent to [`fcl.authenticate()`](<#fcl.authenticate()>).

---

## `fcl.login()`

> :warning: **This method can only be used in web browsers.**

A **convenience method** that calls and is equivalent to [`fcl.authenticate()`](<#fcl.authenticate()>).

---

## `fcl.authz`

A **convenience method** that produces the needed authorization details for the current user to submit transactions to Flow. It defines a signing function that connects to a user's wallet provider to produce signatures to submit transactions.

> :loudspeaker: You can replace this function with your own [authorization function](#authorization-function) if needed.

### Returns

| Type                                        | Description                                                                                              |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [AuthorizationObject](#AuthorizationObject) | An object containing the necessary details from the current user to authorize a transaction in any role. |

### Usage

**Note:** The default values for `proposer`, `payer`, and `authorizations` are already `fcl.authz` so there is no need to include these parameters, it is shown only for example purposes. See more on [signing roles](https://docs.onflow.org/concepts/accounts-and-keys/#signing-a-transaction).

```javascript
import * as fcl from "@onflow/fcl";
// login somewhere before
fcl.authenticate();
// once logged in authz will produce values
console.log(fcl.authz);
// prints {addr, signingFunction, keyId, sequenceNum} from the current authenticated user.

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2
    
    transaction(name: String) {
      prepare(account: AuthAccount) {
        account.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg("myName", t.String)],
  proposer: fcl.authz, // optional - default is fcl.authz
  payer: fcl.authz, // optional - default is fcl.authz
  authorizations: [fcl.authz], // optional - default is [fcl.authz]
});
```

---

## Current User

Holds the [current user](#`CurrentUserObject`), if set, and offers a set of functions to manage the authentication and authorization of the user.

> :warning: **The following methods can only be used in web browsers.**

## Methods

---

## `fcl.currentUser().subscribe(callback)`

The callback passed to subscribe will be called when the user authenticates and un-authenticates, making it easy to update the UI accordingly.

### Arguments

| Name       | Type     | Description                                                                                                                              |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `callback` | function | The callback will be called with the [current user](#`CurrentUserObject`) as the first argument when the current user is set or removed. |

### Usage

```javascript
import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export function AuthCluster() {
  const [user, setUser] = useState({ loggedIn: null });
  useEffect(() => fcl.currentUser().subscribe(setUser), []); // sets the callback for FCL to use

  if (user.loggedIn) {
    return (
      <div>
        <span>{user?.addr ?? "No Address"}</span>
        <button onClick={fcl.unauthenticate}>Log Out</button> {/* once logged out in setUser(user) will be called */}
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>{" "}
        {/* once logged in setUser(user) will be called */}
        <button onClick={fcl.signUp}>Sign Up</button> {/* once signed up, setUser(user) will be called */}
      </div>
    );
  }
}
```

---

## `fcl.currentUser().snapshot()`

Returns the [current user](#`CurrentUserObject`) object. This is the same object that is set and available on [`fcl.currentUser().subscribe(callback)`](<##`fcl.currentUser().subscribe(callback)`>).

### Usage

```javascript
// returns the current user object
const user = fcl.currentUser().snapshot();

// subscribes to the current user object and logs to console on changes
fcl.currentUser().subscribe(console.log);
```

---

## `fcl.currentUser().authenticate()`

Equivalent to `fcl.authenticate()`.

---

## `fcl.currentUser().unauthenticate()`

Equivalent to `fcl.unauthenticate()`.

---

## `fcl.currentUser().authorization()`

Equivalent to `fcl.authz`.

---

# On-chain Interactions

> :loudspeaker: **These methods can be used in browsers and NodeJS.**

These methods allows dapps to interact directly with the Flow blockchain via a set of functions that currently use the [Access Node API](https://docs.onflow.org/access-api/).

## Methods

---

## Query and Mutate Flow with Cadence

If you want to run arbitrary Cadence scripts on the blockchain, these methods offer a convenient way to do so **without having to build, send, and decode interactions**.

## `fcl.query({...options})`

Allows you to submit scripts to query the blockchain.

### Options

_Pass in the following as a single object with the following keys.All keys are optional unless otherwise stated._

| Key       | Type                                    | Description                                                                                                 |
| --------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `cadence` | string **(required)**                   | A valid cadence script.                                                                                     |
| `args`    | [ArgumentFunction](#`ArgumentFunction`) | Any arguments to the script if needed should be supplied via a function that returns an array of arguments. |
| `limit`   | number                                  | Compute limit for query. :tomato: WHAT UNITS ARE THESE IN?                                                  |

### Returns

| Type | Description                            |
| ---- | -------------------------------------- |
| any  | A JSON representation of the response. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const result = await fcl.query({
  cadence: `
    pub fun main(a: Int, b: Int, addr: Address): Int {
      log(addr)
      return a + b
    }
  `,
  args: (arg, t) => [
    arg(7, t.Int), // a: Int
    arg(6, t.Int), // b: Int
    arg("0xba1132bc08f82fe2", t.Address), // addr: Address
  ],
});
console.log(result); // 13
```

### Examples

- [Additional Explanation](https://gist.github.com/orodio/3bf977a0bd45b990d16fdc1459b129a2)

---

## `fcl.mutate({...options})`

Allows you to submit transactions to the blockchain to potentially mutate the state.

:warning: When being used in the browser, `fcl.mutate` uses the built-in `fcl.authz` function to produce the authorization (signatures) for the current user. When calling this method from Node.js, you will need to supply your own custom authorization function.

### Options

_Pass in the following as a single object with the following keys. All keys are optional unless otherwise stated._

| Key        | Type                                            | Description                                                                                                                             |
| ---------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `cadence`  | string **(required)**                           | A valid cadence transaction.                                                                                                            |
| `args`     | [ArgumentFunction](##`ArgumentFunction`)        | Any arguments to the script if needed should be supplied via a function that returns an array of arguments.                             |
| `limit`    | number                                          | Compute limit for query. :tomato: WHAT UNITS ARE THESE IN?                                                                              |
| `proposer` | [AuthorizationFunction](#AuthorizationFunction) | The authorization function that returns a valid [AuthorizationObject](#AuthorizationObject) for the [proposer role](#TransactionRoles). |

### Returns

| Type   | Description         |
| ------ | ------------------- |
| string | The transaction ID. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// login somewhere before
fcl.authenticate();

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2
    
    transaction(name: String) {
      prepare(account: AuthAccount) {
        account.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg("myName", t.String)],
});
```

### Examples

- [Additional explanation](https://gist.github.com/orodio/3bf977a0bd45b990d16fdc1459b129a2)
- [Custom authorization function](#authorization-function)

---

## Query and mutate the blockchain with Builders

In some cases, you may want to utilize pre-built interactions or build more complex interactions than what the `fcl.query` and `fcl.mutate` interface offer. To do this, FCL uses a pattern of building up an interaction with a combination of builders, resolving them, and sending them to the chain.

> :warning: **Recommendation:** Unless you have a specific use case that require usage of these builders, you should be able to achieve most cases with `fcl.query({...options}` or `fcl.mutate({...options})`

## `fcl.send([...builders])`

Sends arbitrary scripts, transactions, and requests to Flow.

This method consumes an array of [builders](https://google.ca) that are to be resolved and sent. The builders required to be included in the array depend on the [interaction](#`Interactions`) that is being built.

### Note

:warning: Must be used in conjuction with [`fcl.decode(response)`](<#fcl.decode(response)>) to get back correct keys and all values in JSON.

### Arguments

| Name       | Type                    | Description            |
| ---------- | ----------------------- | ---------------------- |
| `builders` | [[Builders](#builders)] | See builder functions. |

### Returns

| Type                              | Description                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ResponseObject](#ResponseObject) | An object containing the data returned from the chain. Should always be decoded with `fcl.decode()` to get back appropriate JSON keys and values. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

// a script only needs to resolve the arguments to the script
const response = await fcl.send([fcl.script`${script}`, fcl.args(args)]);
// note: response values are encoded, call await fcl.decode(response) to get JSON

// a transaction requires multiple 'builders' that need to be resolved prior to being sent to the chain - such as setting the authorizations.
const response = await fcl.send([
  fcl.transaction`
    ${transaction}
    `,
  fcl.args(args),
  fcl.proposer(proposer),
  fcl.authorizations(authorizations),
  fcl.payer(payer),
  fcl.limit(9999),
]);
// note: response contains several values (Cad)
```

### Examples

- [Getting a user account](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Getting the latest block](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Sending a transaction](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## `fcl.decode(response)`

Decodes the response from `fcl.send()` into the appropriate JSON representation of any values returned from Cadence code.

### Note

:loudspeaker: To define your own decoder, see [`tutorial`](#https://github.com/onflow/flow-js-sdk/tree/master/packages/sdk/src/decode).

### Arguments

| Name       | Type                                | Description                                            |
| ---------- | ----------------------------------- | ------------------------------------------------------ |
| `response` | [ResponseObject](#`ResponseObject`) | Should be the response returned from `fcl.send([...])` |

### Returns

| Type | Description                                                                                                                                                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| any  | A JSON representation of the raw string response depending on the cadence code executed.<br> The return value can be a single value and type or an object with multiple types. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

// simple script to add 2 numbers
const response = await fcl.send([
  fcl.script`
        pub fun main(int1: Int, int2: Int): Int {
            return int1 + int2
        }
    `,
  fcl.args([fcl.arg(1, types.Int), fcl.arg(2, types.Int)]),
]);

const decoded = await fcl.decode(response);

assert(3 === decoded);
assert(typeof decoded === "number");
```

### Examples

- [Getting a user account](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Getting the latest block](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)
- [Sending a transaction](https://github.com/onflow/kitty-items/blob/master/web/src/hooks/use-current-user.hook.js)

---

## Builders

These methods fill out various portions of a transaction or script template in order to
build, resolve, and send it to the blockchain. A valid populated template is referred to as an [Interaction](#Interaction).

:warning: **These methods must be used with `fcl.send([...builders]).then(fcl.decode)`**

## Query Builders

## `fcl.getAccount(address)`

A builder function that returns the interaction to get an account by address.

:warning: Consider using the pre-built interaction [`fcl.account(address)`](<#fcl.account(address)>) if you do not need to pair with any other builders.

### Arguments

| Name      | Type                | Description                                                                        |
| --------- | ------------------- | ---------------------------------------------------------------------------------- |
| `address` | [Address](#Address) | Address of the user account with or without a prefix (both formats are supported). |

### Returns after decoding

| Type                      | Description                              |
| ------------------------- | ---------------------------------------- |
| [AccountObject](#Account) | A JSON representation of a user account. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

// somewhere in an async function
// fcl.account is the same as this function
const getAccount = async (address) => {
  const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);
  return account;
};
```

---

## `fcl.getBlock(isSealed)`

A builder function that returns the interaction to get the latest block.

:loudspeaker: Use with `fcl.atBlockId()` and `fcl.atBlockHeight()` when building the interaction to get information for older blocks.

:warning: Consider using the pre-built interaction [`fcl.latestBlock(isSealed)`](<#fcl.latestBlock(isSealed)>) if you do not need to pair with any other builders.

### Arguments

| Name       | Type    | Default | Description                                                                      |
| ---------- | ------- | ------- | -------------------------------------------------------------------------------- |
| `isSealed` | boolean | false   | If the latest block should be sealed or not. See [block states](#`Interaction`). |

### Returns after decoding

| Type                          | Description                                           |
| ----------------------------- | ----------------------------------------------------- |
| [BlockObject](#`BlockObject`) | The latest block if not used with any other builders. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const latestSealedBlock = await fcl
  .send([
    fcl.getBlock(true), // isSealed = true
  ])
  .then(fcl.decode);
```

---

## `fcl.atBlockHeight(blockHeight)`

A builder function that returns a partial interaction to a block at a specific height.

:warning: Use with other interactions like [`fcl.getBlock()`](<#`fcl.getBlock(isSealed)`>) to get a full interaction at the specified block height.

### Arguments

| Name          | Type   | Description                                            |
| ------------- | ------ | ------------------------------------------------------ |
| `blockHeight` | number | The height of the block to execute the interaction at. |

### Returns

| Type                                  | Description                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](#`Interaction`) | A partial interaction to be paired with another interaction such as `fcl.getBlock()` or `fcl.getAccount()`. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

await fcl.send([fcl.getBlock(), fcl.atBlockHeight(123)]).then(fcl.decode);
```

---

## `fcl.atBlockId(blockId)`

A builder function that returns a partial interaction to a block at a specific block ID.

:warning: Use with other interactions like [`fcl.getBlock()`](<#`fcl.getBlock(isSealed)`>) to get a full interaction at the specified block ID.

### Arguments

| Name      | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| `blockId` | string | The ID of the block to execute the interaction at. |

### Returns

| Type                                  | Description                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](#`Interaction`) | A partial interaction to be paired with another interaction such as `fcl.getBlock()` or `fcl.getAccount()`. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

await fcl.send([fcl.getBlock(), fcl.atBlockId("23232323232")]).then(fcl.decode);
```

---

## `fcl.getBlockHeader()`

A builder function that returns the interaction to get a block header.

:loudspeaker: Use with `fcl.atBlockId()` and `fcl.atBlockHeight()` when building the interaction to get information for older blocks.

### Returns after decoding

| Type                                    | Description                                                  |
| --------------------------------------- | ------------------------------------------------------------ |
| [BlockHeaderObject](#BlockHeaderObject) | The latest block header if not used with any other builders. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const latestBlockHeader = await fcl
  .send([fcl.getBlockHeader()])
  .then(fcl.decode);
```

## `fcl.getEventsAtBlockHeightRange(eventName,fromBlockHeight,toBlockHeight)`

A builder function that returns all instances of a particular event (by name) within a height range.

:warning: The block range provided must be from the current spork.

:warning: The block range provided must be 250 blocks or lower per request.

### Arguments

| Name              | Type                    | Description                                                      |
| ----------------- | ----------------------- | ---------------------------------------------------------------- |
| `eventName`       | [EventName](#EventName) | The name of the event.                                           |
| `fromBlockHeight` | number                  | The height of the block to start looking for events (inclusive). |
| `toBlockHeight`   | number                  | The height of the block to stop looking for events (inclusive).  |

### Returns after decoding

| Type                          | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| [[EventObject]](#EventObject) | An array of events that matched the eventName. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const events = await fcl
  .send([
    fcl.getEventsAtBlockHeightRange(
      "A.7e60df042a9c0868.FlowToken.TokensWithdrawn",
      35580624,
      35580624
    ),
  ])
  .then(fcl.decode);
```

---

## `fcl.getEventsAtBlockIds(eventName,[...blockIds])`

A builder function that returns all instances of a particular event (by name) within a set of blocks, specified by block ids.

:warning: The block range provided must be from the current spork.

### Arguments

| Name        | Type                    | Description                               |
| ----------- | ----------------------- | ----------------------------------------- |
| `eventName` | [EventName](#EventName) | The name of the event.                    |
| `blockIds`  | number                  | The ids of the blocks to scan for events. |

### Returns after decoding

| Type                          | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| [[EventObject]](#EventObject) | An array of events that matched the eventName. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const events = await fcl
  .send([
    fcl.getEventsAtBlockIds("A.7e60df042a9c0868.FlowToken.TokensWithdrawn", [
      "c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7",
      "5dbaa85922eb194a3dc463c946cc01c866f2ff2b88f3e59e21c0d8d00113273f",
    ]),
  ])
  .then(fcl.decode);
```

---

## `fcl.getCollection(collectionID)`

A builder function that returns all a collection containing a list of transaction ids by its collection id.

:warning: The block range provided must be from the current spork. All events emitted during past sporks is current unavailable.

### Arguments

| Name           | Type   | Description               |
| -------------- | ------ | ------------------------- |
| `collectionID` | string | The id of the collection. |

### Returns after decoding

| Type                                  | Description                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| [CollectionObject](#CollectionObject) | An object with the id and a list of transactions within the requested collection. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const collection = await fcl
  .send([
    fcl.getCollection(
      "cccdb0c67d015dc7f6444e8f62a3244ed650215ed66b90603006c70c5ef1f6e5"
    ),
  ])
  .then(fcl.decode);
```

---

## `fcl.getTransactionStatus(transactionId)`

A builder function that returns the status of transaction.

:warning: The transactionID provided must be from the current spork.

:loudspeaker: Considering [subscribing to the transaction from `fcl.tx(id)`](<##`fcl.tx(transactionId)>) instead of calling this method directly.

### Arguments

| Name            | Type   | Description                                                                                                                           |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `transactionId` | string | The transactionID returned when submitting a transaction. Example: `9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3` |

### Returns after decoding

| Name           | Type                                      | Description                                                     |
| -------------- | ----------------------------------------- | --------------------------------------------------------------- |
| `events`       | [[EventObject]](#EventObject)             | An array of events that were emitted during the transaction.    |
| `status`       | [TransactionStatus](#TransactionStatuses) | The status of the transaction on the blockchain.                |
| `errorMessage` | string                                    | An error message if it exists. Default is an empty string `''`. |
| `statusCode`   | [GRPCStatus](#grpc-statuses)              | The status from the GRPC response.                              |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const status = await fcl
  .send([
    fcl.getTransactionStatus(
      "9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3"
    ),
  ])
  .then(fcl.decode);
```

---

## `fcl.getTransaction(transactionId)`

A builder function that returns a [transaction object](##TransactionObject>) once decoded.

:warning: The transactionID provided must be from the current spork.

:loudspeaker: Considering using [`fcl.tx(id).onceSealed()`](<##`fcl.tx(transactionId)>) instead of calling this method directly.

### Arguments

| Name            | Type   | Description                                                                                                                           |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `transactionId` | string | The transactionID returned when submitting a transaction. Example: `9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3` |

### Returns after decoding

| Name           | Type                                       | Description                                                     |
| -------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `events`       | [[EventObject]](#EventObject)              | An array of events that matched the eventName.                  |
| `status`       | [TransactionStatus](##`TransactionStatus`) | The status of the transaction on the blockchain.                |
| `errorMessage` | string                                     | An error message if it exists. Default is an empty string `''`. |
| `statusCode`   | [GRPCStatus](##`TransactionStatus`)        | The status from the GRPC response.                              |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const tx = await fcl
  .send([
    fcl.getTransaction(
      "9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3"
    ),
  ])
  .then(fcl.decode);
```

---

## `fcl.getEvents(eventName,fromBlock,toBlock)` - Deprecated

Use [`fcl.getEventsAtBlockHeightRange`](##`fcl.getEventsAtBlockHeightRange`) or [`fcl.getEventsAtBlockIds`](##`fcl.getEventsAtBlockIds`).

---

## `fcl.getLatestBlock(isSealed)` - Deprecated

Use [`fcl.getBlock`](##`fcl.getBlock`).

---

## `fcl.getBlockById(blockId)` - Deprecated

Use [`fcl.getBlock`](##`fcl.getBlock`) and [`fcl.atBlockId`](##`fcl.atBlockId`).

---

## `fcl.getBlockByHeight(blockHeight)` - Deprecated

Use [`fcl.getBlock`](##`fcl.getBlock`) and [`fcl.atBlockHeight`](##`fcl.atBlockHeight`).

---

## Utility Builders

These builders are used to compose interactions with other builders such as scripts and transactions.

> :warning: **Recommendation:** Unless you have a specific use case that require usage of these builders, you should be able to achieve most cases with `fcl.query({...options}` or `fcl.mutate({...options})`

## `fcl.arg(value, type)`

A utility builder to be used with `fcl.args[...]` to create FCL supported arguments for interactions.

### Arguments

| Name    | Type                | Description                                               |
| ------- | ------------------- | --------------------------------------------------------- |
| `value` | any                 | Any value that you are looking to pass to other builders. |
| `type`  | [FType](##`FTypes`) | A type supported by Flow.                                 |

### Returns

| Type                                 | Description                         |
| ------------------------------------ | ----------------------------------- |
| [ArgumentObject](##`ArgumentObject`) | Holds the value and type passed in. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

await fcl
  .send([
    fcl.script`
      pub fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    fcl.args([
      fcl.arg(5, t.Int), // a
      fcl.arg(4, t.Int), // b
    ]),
  ])
  .then(fcl.decode);
```

---

## `fcl.args([...args])`

A utility builder to be used with other builders to pass in arguments with a value and supported type.

### Arguments

| Name   | Type                                     | Description                                                           |
| ------ | ---------------------------------------- | --------------------------------------------------------------------- |
| `args` | [[Argument Objects]](##`ArgumentObject`) | An array of arguments that you are looking to pass to other builders. |

### Returns

| Type                                | Description                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](#Interaction) | An interaction that contains the arguments and types passed in. This alone is a partial and incomplete interaction. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

await fcl
  .send([
    fcl.script`
      pub fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    fcl.args([
      fcl.arg(5, t.Int), // a
      fcl.arg(4, t.Int), // b
    ]),
  ])
  .then(fcl.decode); // 9
```

---

## Template Builders

> :warning: **_Reccomended:_** The following functionality is simplified by [`fcl.query({...options}`](<#fcl.query({...options})>) or [`fcl.mutate({...options})`](<#fcl.mutate({...options})>) and is reccomended to use over the functions below.

## `fcl.script(CODE)`

A template builder to use a Cadence script for an interaction.

:loudspeaker: Use with `fcl.args(...)` to pass in arguments dynamically.

### Arguments

| Name   | Type   | Description                     |
| ------ | ------ | ------------------------------- |
| `CODE` | string | Should be valid Cadence script. |

### Returns

| Type                        | Description                                   |
| --------------------------- | --------------------------------------------- |
| [Interaction](#Interaction) | An interaction containing the code passed in. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const code = `
  pub fun main(): Int {
    return 5 + 4
  }
`;
const answer = await fcl.send([fcl.script(code)]).then(fcl.decode);
console.log(answer); // 9
```

---

## `fcl.transaction(CODE)`

A template builder to use a Cadence transaction for an interaction.

:warning: Must be used with `fcl.payer`, `fcl.proposer`, `fcl.authorizations` to produce a valid interaction before sending to the chain.

:loudspeaker: Use with `fcl.args[...]` to pass in arguments dynamically.

### Arguments

| Name   | Type   | Description                            |
| ------ | ------ | -------------------------------------- |
| `CODE` | string | Should be valid a Cadence transaction. |

### Returns

| Type                                | Description                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [Partial Interaction](#Interaction) | An partial interaction containing the code passed in. Further builders are required to complete the interaction - see warning. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const code = `
  pub fun main(): Int {
    return 5 + 4
  }
`;
const answer = await fcl.send([fcl.script(code)]).then(fcl.decode);
console.log(answer); // 9
```

---

## Pre-built Interactions

These functions are abstracted short hand ways to skip the send and decode steps of sending an interaction to the chain. More pre-built interactions are coming soon.

## `fcl.account(address)`

A pre-built interaction that returns the details of an account from their public address.

### Arguments

| Name      | Type                   | Description                                                                        |
| --------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `address` | [Address](##`Address`) | Address of the user account with or without a prefix (both formats are supported). |

### Returns

| Type                         | Description                              |
| ---------------------------- | ---------------------------------------- |
| [AccountObject](##`Account`) | A JSON representation of a user account. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
const account = await fcl.account("0x1d007d755706c469");
```

---

## `fcl.latestBlock(isSealed)`

A pre-built interaction that returns the latest block (optionally sealed or not).

### Arguments

| Name       | Type    | Default | Description                                                                    |
| ---------- | ------- | ------- | ------------------------------------------------------------------------------ |
| `isSealed` | boolean | false   | If the latest block should be sealed or not. See [block states](#Interaction). |

### Returns

| Type                        | Description                       |
| --------------------------- | --------------------------------- |
| [BlockObject](#BlockObject) | A JSON representation of a block. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
const latestBlock = await fcl.latestBlock();
```

---

## Transaction Status Utility

## `fcl.tx(transactionId)`

A utility function that lets you set the transaction to get subsequent status updates (via polling) and the finalized result once available.
:warning: The poll rate is set at `2500ms` and will update at that interval until transaction is sealed.

### Arguments

| Name            | Type   | Description             |
| --------------- | ------ | ----------------------- |
| `transactionId` | string | A valid transaction id. |

### Returns

| Name              | Type     | Description                                                                                              |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `snapshot()`      | function | Returns the current state of the transaction.                                                            |
| `subscribe(cb)`   | function | Calls the `cb` passed in with the new transaction on a status change.                                    |
| `onceFinalized()` | function | Provides the transaction once status `2` is returned. See [Tranasaction Statuses](#TransactionStatuses). |
| `onceExecuted()`  | function | Provides the transaction once status `3` is returned. See [Tranasaction Statuses](#TransactionStatuses). |
| `onceSealed()`    | function | Provides the transaction once status `4` is returned. See [Tranasaction Statuses](#TransactionStatuses). |

### Usage

```javascript
import * as fcl from "@onflow/fcl";

const [txStatus, setTxStatus] = useState(null);
useEffect(() => fcl.tx(txId).subscribe(setTxStatus));
```

### Examples

- [React Effect to get the transaction status on submit](https://github.com/onflow/flow-port/blob/staging/src/pages/transaction-status.js#L158-L183)
- [Example usage in Kitty Items app](https://github.com/onflow/kitty-items/blob/master/web/src/flow/util/tx.js#L21-L22)

---

## Event Polling Utility

## `fcl.events(eventName)`

A utility function that lets you set the transaction to get subsequent status updates (via polling) and the finalized result once available.
:warning: The poll rate is set at `10000ms` and will update at that interval for getting new events.

### Arguments

| Name        | Type   | Description         |
| ----------- | ------ | ------------------- |
| `eventName` | string | A valid event name. |

### Returns

| Name            | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `subscribe(cb)` | function | Calls the `cb` passed in with the new event. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
// in some react component
fcl.events(eventKey).subscribe((event) => {
  console.log(event)
})
```

### Examples

- [Flow-view-source example](https://github.com/orodio/flow-view-source/blob/master/src/pages/event.comp.js)

---

# Types, Interfaces, and Definitions

---

## `Builders`

Builders are modular functions that can be coupled together with `fcl.send([...builders])` to create an [Interaction](##`Interactions`). The builders needed to create an interaction depend on the script or transaction that is being sent.

---

## `Interaction`

An interaction is an object containing the information to perform an action on chain.This object is populated through builders and converted into the approriate access node API call. See the interaction object [here](https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/src/interaction/interaction.js). A 'partial' interaction is an interaction object that does not have sufficient information to the intended on-chain action. Multiple partial interactions (through builders) can be coupled to create a complete interaction.

---

## `CurrentUserObject`

| Key         | Value Type             | Default   | Description                                                                                                                                                       |
| ----------- | ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addr`      | [Address](##`Address`) | `null`    | The public address of the current user                                                                                                                            |
| `cid`       | string                 | `null`    | :tomato: TODO                                                                                                                                                     |
| `expiresAt` | number                 | `null`    | If the current session expires the value will be non-null. :tomato: UNSURE                                                                                        |
| `f_type`    | string                 | `'USER'`  | A type identifier used internally by FCL.                                                                                                                         |
| `f_vsn`     | string                 | `'1.0.0'` | The version to use when passing messages between the provider and the dapp. :tomato: UNSURE                                                                       |
| `loggedIn`  | boolean                | `null`    | If the user is logged in.                                                                                                                                         |
| `services`  | [ServiceObject]        | `[]`      | A list of services that offer specific functionality (eg. authorization) from the wallet provider to the logged in user. :tomato: More documentation coming soon. |

---

## `AuthorizationObject`

This type conforms to the interface required for FCL to authorize transaction on behalf o the current user.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `addr` | [Address](##`Address`) | The address of the authorizer |
| `signingFunction` | function | A function that allows FCL to sign using the authorization details and produce a valid signature. |
| `keyId` | number | The index of the key to use during authorization. (Multiple keys on an account is possible). |
| `sequenceNum` | number | A number that is incremented per transaction using they keyId. |

---

## `SignableObject`

An object that contains all the information needed for FCL to sign a message with the user's signature.

| Key         | Value Type             | Description                                                                                          |
| ----------- | ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `addr`      | [Address](##`Address`) | The address of the authorizer                                                                        |
| `keyId`     | number                 | The index of the key to use during authorization. (Multiple keys on an account is possible).         |
| `signature` | function               | A [SigningFunction](#Signing-Function) that can produce a valid signature for a user from a message. |

---

## `AccountObject`

The JSON representation of an account on the Flow blockchain.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `address` | [Address](#Address) | The address of the account |
| `balance` | number | The FLOW balance of the account in 10\*6. |
| `code` | [Code](#Code) | ???? |
| `contracts` | Object: [Contract](#contract) | An object with keys as the contract name deployed and the value as the the cadence string. |
| `keys` | [[KeyObject]](#Key) | Any contracts deployed to this account. |

---

## `Address`

| Value Type        | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| string(formatted) | A valid Flow address should be 16 characters in length. <br>A `0x` prefix is optional during inputs. <br>eg. `f8d6e0586b0a20c1` |

---

## `ArgumentObject`

An argument object created by `fcl.arg(value,type)`
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `value` | any | Any value to be used as an argument to a builder. |
| `xform` | [FType](##`FType`) | Any of the supported types on Flow. |

---

## `ArgumentFunction`

An function that takes the `fcl.arg` function and fcl types `t` and returns an array of `fcl.arg(value,type)`.

`(arg, t) => Array<Arg>`

| Parameter Name | Value Type          | Description                                                                  |
| -------------- | ------------------- | ---------------------------------------------------------------------------- |
| `arg`          | function            | A function that returns an [ArgumentObject](##`ArgumentObject`) - `fcl.arg`. |
| `t`            | [FTypes](##`FType`) | An object with acccess to all of the supported types on Flow.                |

**Returns**
| Value Type | Description |
|----------- | ----------- |
| `[fcl.args]` | Array of `fcl.args`. |

---

## `Authorization Function`

An authorization function must produce the information of the user that is going to sign and a signing function to use the information to produce a signature.

:warning: This function is always async.

:loudspeaker: By default FCL exposes `fcl.authz` that produces the authorization object for the current user (given they are signed in and only on the browser). Replace this with your own function that conforms to this interface to use it wherever an authorization object is needed.

| Parameter Name | Value Type                      | Description                                    |
| -------------- | ------------------------------- | ---------------------------------------------- |
| `account`      | [AccountObject](#AccountObject) | The account of the user that is going to sign. |

**Returns**
| Value Type | Description |
|----------- | ----------- |
| Promise<[AuthorizationObject](#AuthorizationObject)> | The object that contains all the information needed by FCL to authorize a user's transaction. |

### Usage

---

```javascript
const authorizationFunction = async (account) => {
    // authorization function need to return an account
    const { address, keys } = account
    const tempId = `${address}-${keys[process.env.minterAccountIndex]}`;
    const keyId = Number(KEY_ID);
    let signingFunction = async signable => {
      return {
        keyId,
        addr: fcl.withPrefix(address),
        signature: sign(process.env.FLOW_MINTER_PRIVATE_KEY, signable.message), // signing function, read below
      }
    }
    return {
    ...account,
    address,
    keyId,
    tempId,
    signingFunction,
  }
```

### Examples:

- [Node.js Service using the service account to authorize a minter](https://github.com/onflow/kitty-items/blob/master/api/src/services/flow.ts)
- [Detailed explanation](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/wallet-provider-spec/authorization-function.md)

---

## `Signing Function`

Consumes a payload and produces a signature for a transaction.

:warning: This function is always async.

:loudspeaker: Only write your own signing function if you are writing your own custom authorization function.

### Payload

Note: These values are destructed from the payload object in the first argument.

| Parameter Name | Value Type | Description                                                                                                                          |
| -------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `message`      | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `addr`         | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `keyId`        | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `roles`        | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `voucher`      | object     | The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message. |

**Returns**
| Value Type | Description |
|----------- | ----------- |
| Promise<[SignableObject](##`SignableObject`)> | The object that contains all the information needed by FCL to authorize a user's transaction. |

### Usage

```javascript
import * as fcl from "@onflow/fcl";
import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
const ec: EC = new EC("p256");

const produceSignature = (privateKey, msg) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(this.hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

const signingFunction = ({
  message, // The encoded string which needs to be used to produce the signature.
  addr, // The address of the Flow Account this signature is to be produced for.
  keyId, // The keyId of the key which is to be used to produce the signature.
  roles: {
    proposer, // A Boolean representing if this signature to be produced for a proposer.
    authorizer, // A Boolean representing if this signature to be produced for a authorizer.
    payer, // A Boolean representing if this signature to be produced for a payer.
  },
  voucher, // The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message.
}) => {
  return {
    addr, // The address of the Flow Account this signature was produced for.
    keyId, // The keyId for which key was used to produce the signature.
    signature: produceSignature(message), // The hex encoded string representing the signature of the message.
  };
};
```

### Examples:

- [Node.js Service using the service account to authorize a minter](https://github.com/onflow/kitty-items/blob/master/api/src/services/flow.ts)
- [Detailed explanation](https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/wallet-provider-spec/authorization-function.md)

---

## `TransactionRolesObject`

| Key Name   | Value Type | Description                                                                |
| ---------- | ---------- | -------------------------------------------------------------------------- |
| proposer   | boolean    | A Boolean representing if this signature to be produced for a proposer.    |
| authorizer | boolean    | A Boolean representing if this signature to be produced for an authorizer. |
| payer      | boolean    | A Boolean representing if this signature to be produced for a payer.       |

For more on what each transaction role means, see [singing roles](https://docs.onflow.org/concepts/transaction-signing/#signer-roles).

## `EventName`

| Value Type        | Description                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| string(formatted) | A event name in Flow must follow the format `A.{AccountAddress}.{ContractName}.{EventName}` <br>eg. `A.ba1132bc08f82fe2.Debug.Log` |

## `Contract`

| Value Type        | Description                                          |
| ----------------- | ---------------------------------------------------- |
| string(formatted) | A formatted string that is a valid cadence contract. |

## `KeyObject`

This is the JSON representation of a key on the Flow blockchain.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `index` | number | The address of the account |
| `publicKey` | string | The FLOW balance of the account in 10\*6. |
| `signAlgo` | number | An index referring to one of `ECDSA_P256` or `ECDSA_secp256k1` |
| `hashAlgo` | number | An index referring to one of `SHA2_256` or `SHA3_256` |
| `weight` | number | A number between 1 and 1000 indicating the relative weight to other keys on the account. |
| `sequenceNumber` | number | This number is incremented for every transaction signed using this key. |
| `revoked` | boolean | If this key has been disabled for use. |

## `BlockObject`

The JSON representation of a key on the Flow blockchain.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `id` | string | The id of the block. |
| `parentId` | string | The id of the parent block. |
| `height` | number | The height of the block. |
| `timestamp` | object | Contains time related fields. |
| `collectionGuarantees` | [[CollectionGuaranteeObject](#CollectionGuaranteeObject)] | Contains the ids of collections included in the block. |
| `blockSeals` | [SealedBlockObject] | The details of which nodes executed and sealed the blocks. |
| `signatures` | Uint8Array([numbers]) | All signatures. |

## `BlockHeaderObject`

The subset of the [BlockObject](#BlockObject) containing only the header values of a block.

| Key         | Value Type | Description                   |
| ----------- | ---------- | ----------------------------- |
| `id`        | string     | The id of the block.          |
| `parentId`  | string     | The id of the parent block.   |
| `height`    | number     | The height of the block.      |
| `timestamp` | object     | Contains time related fields. |

## `CollectionGuaranteeObject`

A collection that has been included in a block.

| Key            | Value Type        | Description          |
| -------------- | ----------------- | -------------------- |
| `collectionId` | string            | The id of the block. |
| `signatures`   | [SignatureObject] | All signatures.      |

## `CollectionObject`

A collection is a list of transactions that are contained in the same block.
| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `id` | string | The id of the collection. |
| `transactionIds` | [string] | The ids of the transactions included in the collection. |

## `ResponseObject`

The format of all responses in FCL returned from `fcl.send(...)`. For full details on the values and descriptions of the keys, view [here](https://github.com/onflow/flow-js-sdk/tree/master/packages/sdk/src/response).
| Key |
| ---- |
| `tag` |
| `transaction` |
| `transactionStatus` |
| `transactionId` |
| `encodedData` |
| `events` |
| `account` |
| `block` |
| `blockHeader` |
| `latestBlock` |
| `collection` |

## `Event Object`

| Key | Value Type | Description |
| ---- | ---------- | ----------- |
| `blockId` | string | ID of the block that contains the event. |
| `blockHeight` | number| Height of the block that contains the event. |
| `blockTimestamp` | string | The timestamp of when the block was sealed in a `DateString` format. eg. `'2021-06-25T13:42:04.227Z'` |
| `type` | [EventName](#EventName) | A string containing the event name. |
| `transactionId` | object | :tomato: TODO |
| `transactionIndex` | object | :tomato: TODO |
| `eventIndex` | object | :tomato: TODO |
| `data` | any | The data emitted from the event. |

## `Transaction Statuses`

The status of a transaction will depend on the Flow blockchain network and which phase it is in as it completes and is finalized.
| Status Code | Description |
| ----------- | ----------- |
| `0` | Unknown
| `1` | Transaction Pending - Awaiting Finalization
| `2` | Transaction Finalized - Awaiting Execution
| `3` | Transaction Executed - Awaiting Sealing
| `4` | Transaction Sealed - Transaction Complete
| `5` | Transaction Expired
:tomato: TODO better descriptions.

## `GRPC Statuses`

The access node GRPC implementation follows the standard GRPC Core status code spec. View [here](https://grpc.github.io/grpc/core/md_doc_statuscodes.html).

## `FType`

FCL arguments must specify one of the following support types for each value passed in.
| Type | Example
| ---- | ---- |
| `UInt` | `fcl.arg(1, t.UInt)` |
| `UInt8` |  `fcl.arg(8, t.UInt8)` |
| `UInt16` | `fcl.arg(16, t.UInt16)` |
| `UInt32` | `fcl.arg(32, t.UInt32)` |
| `UInt64` | `fcl.arg(64, t.UInt64)` |
| `UInt128` | `fcl.arg(128, t.UInt128)` |
| `UInt256` | `fcl.arg(256, t.UInt256)` |
| `Int` | `fcl.arg(1, t.Int)` |
| `Int8` |  `fcl.arg(8, t.Int8)` |
| `Int16` | `fcl.arg(16, t.Int16)` |
| `Int32` | `fcl.arg(32, t.Int32)` |
| `Int64` | `fcl.arg(64, t.Int64)` |
| `Int128` | `fcl.arg(128, t.Int128)` |
| `Int256` | `fcl.arg(256, t.Int256)` |
| `Word8` | `fcl.arg(8, t.Word8)` |
| `Word16` |  `fcl.arg(16, t.Word16)` |
| `Word32` | `fcl.arg(32, t.Word32)` |
| `Word64` | `fcl.arg(64, t.Word64)` |
| `UFix64` | `fcl.arg("64.123", t.UFix256)`|
| `Fix64` | `fcl.arg("64.123", t.Fix256)`|
| `String` | `fcl.arg("Flow", t.String)`|
| `Character` | `fcl.arg("c", t.String)`|
| `Bool` | `fcl.arg(true, t.String)`|
| `Address` | `fcl.arg("0xABC123DEF456", t.String)`|
| `Optional` | `fcl.arg("Flow", t.Optional(t.String))` |
| `Array` | `fcl.args([ fcl.arg(["First", "Second"], t.Array(t.String)) ])`
| `Dictionary` | `fcl.args([fcl.arg([{key: 1, value: "one"}, {key: 2, value: "two"}], t.Dictionary({key: t.Int, value: t.String}))])`

---
