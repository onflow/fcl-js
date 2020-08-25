# @onflow/interaction

This module provides an ADT (Abstract Data Type) that represents the underlying data required by the `send` function. It provides function in which to modify the interaction.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Medium

This is a keystone data structure in how the SDK works. We will strive for backwards compatibility in any changes to this, as it also makes our lives easier.
Now that we have a stable encoding package for creating what needs to be signed in transactions, we will be bringing this data structure closer to what those functions need.

Known Upcoming Changes:

- We will be changing some of the underlying fields and data so they are more inline with `@onflow/encode`

# Install

```bash
npm install --save @onflow/interaction
```

## Types of interactions

Currently the Access Node recognizes 7 different types of interactions.

- **Script** executes a script, can be used to query Flow
- **Transaction** executes a transaction
- **GetTransactionStatus** requests the status of a supplied transaction
- **GetAccount** requests a supplied account
- **GetEvents** requests events of a supplied type
- **GetLatestBlock** requests the latest block
- **Ping** requests a pong

## Internal Properties

> The interaction is a monomorphic data structure, that merges the 7 types of interactions together. Internally it has a bunch of properties, but not everything needs to be included for each of the 7 interaction types.


- **tag** _(all)_ `Int` -- a marker that represents the type of the interaction
- **status** _(all)_ `Int` -- a marker that represents the status of the interaction
- **reason** _(all)_ `String` -- used to supply more information/feedback when a status is bad
- **accounts** _(transaction, script)_
  - **kind** _(transaction, script)_ `Int` -- denotes the kind of account, ACCOUNT or PARAM or ARGUMENT
  - **tempId** _(transaction, script)_ `String` -- denotes the internal tempId for this account
  - **addr** _(transaction, script)_ `String` -- denotes the address of this account
  - **keyId** _(transaction, script)_ `Int` -- denotes the keyId in question for this account
  - **sequenceNum** _(transaction, script)_ `Int` -- denotes the sequenceNum in question for this account
  - **signature** _(transaction, script)_ `String` -- the signature produced by the signingFunction for this account
  - **signingFunction** _(transaction, script)_ `Function` -- the signing function for this account
  - **resolve** _(transaction, script)_ `Function` -- the resolver for this account
  - **role** _(transaction, script)_
    - **propser** _(transaction, script)_ `Boolean` -- denotes if this account is a propser
    - **authorizer** _(transaction, script)_ `Boolean` -- denotes if this account is an authorizer
    - **payer** _(transaction, script)_ `Boolean` -- denotes if this account is a payer
    - **param** _(transaction, script)_ `Boolean` -- denotes if this account is a param
- **params** _(transaction, script)_
  - **kind** _(transaction, script)_ `Int` -- denotes the kind of param, ACCOUNT or PARAM or ARGUMENT
  - **tempId** _(transaction, script)_ `String` -- the internal tempId for this param
  - **key** _(transaction, script)_ `String` -- the key for this param
  - **value** _(transaction, script)_ `Any` -- the value for this param
  - **asParam** _(transaction, script)_ `Any` -- the asParam transformed value for this param
  - **xform** _(transaction, script)_ `Any` -- the transform for this param
  - **resolve** _(transaction, script)_ `Function` -- a resolver for this param
- **arguments** _(transaction, script)_
  - **kind** _(transaction, script)_ `Int` -- denotes the kind of argument, ACCOUNT or PARAM or ARGUMENT
  - **tempId** _(transaction, script)_ `String` -- the internal tempId for this argument
  - **value** _(transaction, script)_ `Any` -- the value for this argument
  - **asArgument** _(transaction, script)_ `Any` -- the asArgument transformed value for this argument
  - **xform** _(transaction, script)_ `Any` -- the transform for this argument
  - **resolve** _(transaction, script)_ `Function` -- a resolver for this argument
- **message** _(script, transaction)_
  - **cadence** _(script, transaction)_ `String` -- cadence code
  - **refBlock** _(transaction)_ `String` -- id of an existing block (used for timeout)
  - **computeLimit** _(script)_ `Int` -- how much payer is willing to spend
  - **proposer** _(transaction)_ `String` -- the tempId of the account proposer for a transaction
  - **payer** _(transaction)_ `String` -- the tempId of the payer for a transaction
  - **authorizations** _(transaction)_ `Array<String>` -- list of tempIds referencing the accounts of the authorizers for a transaction
  - **params** _(transaction, script)_ `Array<String>` -- list of tempIds referencing the params for a transaction or script
  - **arguments** _(transaction, script)_ `Array<String>` -- list of tempIds referencing the arguments for a transaction or script
- **proposer** _(transaction)_ `String` -- the tempId referencing the account of the proposer for a transaction
- **payer** _(transaction)_ `String` -- the tempId referencing the account of the payer for a transaction
- **authorizations** _(transaction)_ `Array<String>` -- list of tempIds referencing the accounts of the authorizers for a transaction
- **events** _(getEvents)_
  - **start** _(getEvents)_ `Int` -- events after this
  - **end** _(getEvents)_ `Int` -- events before this
  - **eventType** _(getEvents)_ `String` -- type of events to get
- **latestBlock** _(getLatestBlock)_ `**DEPRECATED**` (see: https://github.com/onflow/flow-js-sdk/blob/master/packages/interaction/WARNINGS.md#0001-Deprecating-latestBlock-field)
  - **isSealed** _(getLatestBlock)_ `Boolean` -- determines if the criteria for the latest block is sealed or not `**DEPRECATED**` (see: https://github.com/onflow/flow-js-sdk/blob/master/packages/interaction/WARNINGS.md#0001-Deprecating-latestBlock-field)
- **block** _(getLatestBlock, getBlockByHeight, getBlockById)_
  - **isSealed** _(getLatestBlock)_ `Boolean` -- determines if the criteria for the latest block is sealed or not.
  - **height** _(getBlockByHeight)_ `Int` -- sets the height for the block to get.
  - **id** _(getBlockById)_ `Int` -- sets the id for the block to get.
- **accountAddr** _(getAccount)_ `String` -- the account to get
- **transactionId** _(getTransactionStatus)_ `String` -- the transaction to get
- **assigns** _(all)_ `{[String]:Any}` -- a pocket to hold things in while building and resolving


## Exposed Constants

**Tags**

|                  Label | asInt | asBin      |
| ---------------------: | :---: | :--------- |
|                UNKNOWN |   1   | 0b00000001 |
|                 SCRIPT |   2   | 0b00000010 |
|            TRANSACTION |   4   | 0b00000100 |
| GET_TRANSACTION_STATUS |   8   | 0b00001000 |
|            GET_ACCOUNT |  16   | 0b00010000 |
|             GET_EVENTS |  32   | 0b00100000 |
|       GET_LATEST_BLOCK |  64   | 0b01000000 |
|                   PING |  128  | 0b10000000 |

**Status**

| Label | asInt | asBin |
| ----: | :---: | :---- |
|   BAD |   1   | 0b01  |
|    OK |   2   | 0b10  |

## Exposed Functions

- **Constructor**
  - [interaction/0](#interaction0)
  - [isInteraction/1](#isinteraction1)
- **Control**
  - [Ok/1](#ok1-and-isok1)
  - [isOk/1](#ok1-and-isok1)
  - [Bad/2](#bad2-isbad1-and-why1)
  - [isBad/1](#bad2-isbad1-and-why1)
  - [why/1](#bad2-isbad1-and-why1)
- **Tags**
  - **Unknown**
    - [makeUnknown/1](#makeunknown1-and-isunknown1)
    - [isUnknown/1](#makeunknown1-and-isunknown1)
  - **Script**
    - [makeScript/1](#makescript1-and-isscript1)
    - [isScript/1](#makescript1-and-isscript1)
  - **Transaction**
    - [makeTransaction/1](#maketransaction1-and-istransaction1)
    - [isTransaction/1](#maketransaction1-and-istransaction1)
  - **GetTransactionStatus**
    - [makeGetTransactionStatus/1](#makegettransactionstatus1-and-isgettransactionstatus1)
    - [isGetTransactionStatus/1](#makegettransactionstatus1-and-isgettransactionstatus1)
  - **GetAccount**
    - [makeGetAccount/1](#makegetaccount1-and-isgetaccount1)
    - [isGetAccount/1](#makegetaccount1-and-isgetaccount1)
  - **GetEvents**
    - [makeGetEvents/1](#makegetevents1-and-isgetevents1)
    - [isGetEvents/1](#makegetevents1-and-isgetevents1)
  - **GetLatestBlock**
    - [makeGetLatestBlock/1](#makegetlatestblock1-and-isgetlatestblock1)
    - [isGetLatestBlock/1](#makegetlatestblock1-and-isgetlatestblock1)
  - **Ping**
    - [makePing/1](#makeping1-and-isping1)
    - [isPing/1](#makeping1-and-isping1)
- **Assigns**
  - [get/3](#get3-put2-update2-and-destory1)
  - [put/2](#get3-put2-update2-and-destory1)
  - [update/2](#get3-put2-update2-and-destory1)
  - [destroy/1](#get3-put2-update2-and-destory1)
- **Accounts**
  - [makeAuthorizer/1](#makeAuthorizer1)
  - [makePayer/1](#makePayer1)
  - [makeProposer/1](#makeProposer1)
- **Params**
  - [makeParam/1](#makeParam1)
- **Composition**
  - [pipe/2](#pipe2)
  - [pipe/1](#pipe2)

### `interaction/0`

> Constructs an empty interaction.

```javascript
import {interaction} from "@onflow/interaction"

const emptyInteraction = interaction()
```

### `isInteraction/1`

> returns true if the value passed to it is an interaction

```javascript
import {interaction, isInteraction} from "@onflow/interaction"

const ix = interaction()

isInteraction(ix) // true
isInteraction("i am a string") // false
```

### `Ok/1` and `isOk/1`

> Sets the status of an interaction to `OK`

```javascript
import {interaction, Ok, isOk} from "@onflow/interaction"

isOk(Ok(interaction())) // true
```

### `Bad/2`, `isBad/1` and `why/1`

> Sets the status of an interaction to `BAD`, can also add a reason as to why its bad.

```javascript
import {interaction, Bad, why} from "@onflow/interaction"

const ix = Bad(interaction, "You were supposed to do the thing")
isBad(ix) // true
why(ix) // "You were supposed to do the thing"
```

### `makeUnknown/1` and `isUnknown/1`

> tags an interaction as Unknown

```javascript
import {interaction, makeUnknown, isUnknown} from "@onflow/interaction"

isUnknown(makeUnknown(interaction())) // true
```

### `makeScript/1` and `isScript/1`

> tags an interaction as a Script interaction

```javascript
import {interaction, makeScript, isScript} from "@onflow/interaction"

isScript(makeScript(interaction())) // true
```

### `makeTransaction/1` and `isTransaction/1`

> tags an interaction as a Transaction interaction

```javascript
import {interaction, makeTransaction, isTransaction} from "@onflow/interaction"

isTransaction(makeTransaction(interaction())) // true
```

### `makeGetTransaction/1` and `isGetTransaction/1`

> tags an interaction as a GetTransactionStatus interaction

```javascript
import {
  interaction,
  makeGetTransactionStatus,
  isGetTransactionStatus,
} from "@onflow/interaction"

isGetTransactionStatus(makeGetTransactionStatus(interaction())) // true
```

### `makeGetAccount/1` and `isGetAccount/1`

> tags an interaction as a GetAccount interaction

```javascript
import {interaction, makeGetAccount, isGetAccount} from "@onflow/interaction"

isGetAccount(makeGetAccount(interaction())) // true
```

### `makeGetEvents/1` and `isGetEvents/1`

> tags an interaction as a GetEvents interaction

```javascript
import {interaction, makeGetEvents, isGetEvents} from "@onflow/interaction"

isGetEvents(makeGetEvents(interaction())) // true
```

### `makeGetLatestBlock/1` and `isGetLatestBlock/1`

> tags an interaction as a GetLatestBlock interaction

```javascript
import {
  interaction,
  makeGetLatestBlock,
  isGetLatestBlock,
} from "@onflow/interaction"

isGetLatestBlock(makeGetLatestBlock(interaction())) // true
```

### `makePing/1` and `isPing/1`

> tags an interaction as a Ping interaction

```javascript
import {interaction, makePing, isPing} from "@onflow/interaction"

isPing(makePing(interaction())) // true
```

### `get/3`, `put/2`, `update/2` and `destory/1`

> crud operations for the assigns pocket inside the interaction. They are specifically designed to be used with `pipe`.

```javascript
import {interaction, get, put, update, destory} from "@onflow/interaction"

let ix = interaction()
get(ix, "count", 0) // 0

ix = put("count", 0)(ix)
get(ix, "count", 0) // 0

ix = update("count", count => count + 1)(ix)
get(ix, "count", 0) // 1

ix = destory("count")(ix)
get(ix, "count", 0) // 0
```

### `makeAuthorizer/1`
> compose an Authorizer account, and registers a tempId for it in the interaction object accounts registry
```javascript
import {makeAuthorizer, makeTransaction, pipe} from "@onflow/interaction"
const ix = pipe([
  makeTransaction``
  makeAuthorizer({ addr: "01", role: { authorizer: true } })
])
```

### `makePayer/1`
> compose a Payer account, and registers a tempId for it in the interaction object accounts registry
```javascript
import {makePayer, makeTransaction, pipe} from "@onflow/interaction"
const ix = pipe([
  makeTransaction``
  makePayer({ addr: "01", role: { payer: true } })
])
```

### `makeProposer/1`
> compose a Proposer account, and registers a tempId for it in the interaction object accounts registry
```javascript
import {makeProposer, makeTransaction, pipe} from "@onflow/interaction"
const ix = pipe([
  makeTransaction``
  makeProposer({ addr: "01", role: { proposer: true } })
])
```

### `makeParam/1`
> compose a Param, and registers a tempId for it in the interaction object params registry
```javascript
import {makeParam, makeTransaction, pipe} from "@onflow/interaction"
const ix = pipe([
  makeTransaction``
  makeParam(...)
])
```

### `pipe/2`

> asynchronously composes transform functions and applys them to an interaction.

```javascript
import {interaction, pipe, put, update} from "@onflow/interaction"

const ix = await pipe(interaction(), [
  put("a", 5),
  put("b", 6),
  update("sum", (_, ix) => get(ix, "a", 0) + get(ix, "b", 0)),
])

get(ix, "sum", 0) // 11
```

### `pipe/1`

> gets passed an array of transform functions, returning a function that takes an interaction to apply the transform functions to asynchronously.

```javascript
import {interaction, pipe, put, update} from "@onflow/interaction"

const run = await pipe([
  put("a", 5),
  put("b", 6),
  update("sum", (_, ix) => get(ix, "a", 0) + get(ix, "b", 0)),
])

const ix = run(interaction())

get(ix, "sum", 0) // 11

// Pipes can also be composed

const p1 = pipe([put("a", 1), put("b", 2)])

const p2 = pipe([put("c", 3), put("d", 4)])

const calc = update("sum", (_, ix) =>
  ["a", "b", "c", "d"].reduce((acc, d) => acc + get(ix, d, 0), 0)
)

const ix = await pipe(interaction(), [p1, p2, calc])
get(ix, "sum", 0) // 10

// Pipes can be stoped

import {Bad, Ok, isBad, why} from "@onflow/interaction"

const countCantBeGreaterThan = value => ix =>
  get(ix, "count", 0) > value ? Bad(ix, `Was greater than ${value}`) : Ok(ix)

const setCount = count => put("count", count)

const incCountBy = amount => update("count", count => count + amount)

const ix = await pipe(interaction(), [
  setCount(5), // count: 5
  countCantBeGreaterThan(10), // Ok
  incCountBy(3), // count: 8
  countCantBeGreaterThan(10), // Ok
  incCountBy(5), // count: 13
  countCantBeGreaterThan(10), // Bad
  incCountBy(9), // never called
])

isBad(ix) // true
why(ix) // "Was greater than 10"
```
