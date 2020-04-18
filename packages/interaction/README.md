# @onflow/interaction

> This module provides an ADT (Abstract Data Type) that represents the underlying data required by the `send` function. It provides function in which to modify the interaction.

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

- **tag** *(all)* `Int` -- a marker that represents the type of the interaction
- **status** *(all)* `Int` -- a marker that represents the status of the interaction
- **reason** *(all)* `String` -- used to supply more information/feedback when a status is bad
- **payload** *(script, transaction)*
  - **code** *(script, transaction)* `String` -- cadence code
  - **ref** *(transaction)* `String` -- id of an existing block (used for timeout)
  - **nonce** *(transaction)* `Int` -- all transactions in Flow need to be unique
  - **limit** *(transaction)* `Int` -- how much payer is willing to spend
- **bounds** *(getEvents)*
  - **start** *(getEvebts)* `Int` -- events after this
  - **end** *(getEvents)* `Int` -- events before this
- **acct** *(getAccount)* `String` -- the account to get
- **authz** *(transaction)* `Array<{acct:String, signature:String}>` -- list of accounts and signatures authorizing a transaction
- **payer** *(transaction)* `{acct:String, signature: String}` -- which account is paying for the transaction and their authorization
- **eventType** *(getEvents)* `String` -- the type of events to query against
- **txId** *(getTransaction)* `String` -- id of the transaction to query against
- **isSealed** *(getLatestBlock)* `Boolean` -- determines if the criteria for the latest block is sealed or **FIND_CORRECT_STATE_NAME**
- **assigns** *(all)* `{[String]:Any}` -- a pocket to hold things in while building and resolving

## Exposed Constants

**Tags**

| Label                   | asInt |      asBin |
|------------------------:|:-----:|:-----------|
| UNKNOWN                 |   1   | 0b00000001 |
| SCRIPT                  |   2   | 0b00000010 |
| TRANSACTION             |   4   | 0b00000100 |
| GET_TRANSACTION_STATUS  |   8   | 0b00001000 |
| GET_ACCOUNT             |  16   | 0b00010000 |
| GET_EVENTS              |  32   | 0b00100000 |
| GET_LATEST_BLOCK        |  64   | 0b01000000 |
| PING                    |  128  | 0b10000000 |

**Status**

| Label | asInt | asBin |
|------:|:-----:|:------|
| BAD   |   1   |  0b01 |
| OK    |   2   |  0b10 |

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
    - [makeGetTransactionStatus/1](#makegettransaction1-and-isgettransactionstatus1)
    - [isGetTransactionStatus/1](#makegettransaction1-and-isgettransactionstatus1)
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
import {interaction, makeGetTransactionStatus, isGetTransactionStatus} from "@onflow/interaction"

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
import {interaction, makeGetLatestBlock, isGetLatestBlock} from "@onflow/interaction"

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

### `pipe/2`

> asynchronously composes transform functions and applys them to an interaction.

```javascript
import {interaction, pipe, put, update} from "@onflow/interaction"

const ix = await pipe(interaction(), [
  put("a", 5),
  put("b", 6),
  update("sum", (_, ix) => get(ix, "a", 0) + get(ix, "b", 0))
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
  update("sum", (_, ix) => get(ix, "a", 0) + get(ix, "b", 0))
])

const ix = run(interaction())

get(ix, "sum", 0) // 11

// Pipes can also be composed

const p1 = pipe([
  put("a", 1),
  put("b", 2),
])

const p2 = pipe([
  put("c", 3),
  put("d", 4),
])

const calc = update("sum", (_, ix) => ["a", "b", "c", "d"].reduce((acc, d) => acc + get(ix, d, 0), 0))

const ix = await pipe(interaction(), [p1, p2, calc])
get(ix, "sum", 0) // 10

// Pipes can be stoped

import { Bad, Ok, isBad, why } from "@onflow/interaction"

const countCantBeGreaterThan = value => ix => 
  get(ix, "count", 0) > value
    ? Bad(ix, `Was greater than ${value}`)
    : Ok(ix)

const setCount = count => put("count", count)

const incCountBy = amount => update("count", (count) => count + amount)

const ix = await pipe(interaction(), [
  setCount(5),                // count: 5
  countCantBeGreaterThan(10), // Ok
  incCountBy(3),              // count: 8
  countCantBeGreaterThan(10), // Ok
  incCountBy(5),              // count: 13
  countCantBeGreaterThan(10), // Bad
  incCountBy(9),              // never called
])

isBad(ix) // true
why(ix) // "Was greater than 10"
```
