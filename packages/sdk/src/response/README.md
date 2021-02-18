# Response

This module provides an ADT (Abstract Data Type) that represents the underlying data returned from the send function.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** Low (if accounting for the below known upcoming change)

Fairly Stable, nothing all that much here. Other modules sort of force this ones hands, because javascript.

Known Upcoming Changes:

- Send functions will be unpacking the JSON-CDC in the encodedData internally instead of the decodeResponse doing this.

# Install

```bash
npm install --save @onflow/sdk
```

{"tag": 0, "transaction":null, "transactionId":null, "encodedData":null, "events": null, "account": null}'

## Internal Properties

> The response is a monomorphic data structure. It has fields for each of the possible data that can be returned from the AccessAPI. The response tag corresponds to the tag of the interaction that generated the response.

- **tag** _(all)_ `int` -- a marker that represents the type of the response. See @onflow/interaction for information on the possible tag values.
- **transaction** _GetTransactionStatus_ -- The response from a GetTransactionStatus requrest.
  - **status** `int` -- The status of the transaction
  - **statusCode** `int` -- The status code of the transaction
  - **errorMessage** `string` -- The error message of the transaction
  - **events** `Array<Event>` -- The events for this result
    - **type** `string` -- The type of this event
    - **transactionId** `int` -- The transactionId of this event
    - **transactionIndex** `int` -- The transactionIndex of this event
    - **eventIndex** `int` -- The index of this event
    - **payload** `Uint8Array` -- The encoded JSON-CDC payload of this event.
- **transactionId** _Transaction_ `string` -- The id of the transaction executed during a Transaction request.
- **encodedData** _ExecuteScript_ `Uint8Array` -- The encoded JSON-CDC data returned from a ExecuteScript request.
- **events** _GetEvents_ -- The events returned from a GetEvents request.
  - **results** `Array<Result>` -- The results returned from a GetEvents request.
    - **blockId** `int` -- The block id of this result
    - **blockHeight** `int` -- The block height of this result
    - **events** `Array<Event>` -- The events for this result
      - **type** `string` -- The type of this event
      - **transactionId** `int` -- The transactionId of this event
      - **transactionIndex** `int` -- The transactionIndex of this event
      - **eventIndex** `int` -- The index of this event
      - **payload** `Uint8Array` -- The encoded JSON-CDC payload of this event.
- **account** _GetAccount_ -- The account returned from a GetAccount request.
  - **address** `string` -- The address of the account
  - **code** `string` -- The code of the account
  - **keys** `Array<Key>` -- The keys of the account
    - **index** `int` -- The index of the key
    - **publicKey** `string` -- The publicKey for this key
    - **signAlgo** `int` -- The signing algorithm for this key
    - **hashAlgo** `int` -- The hash algorithm for this key
    - **weight** `int` -- The weight for this key
    - **sequenceNumber** `int` -- The sequence number for this key

## Exposed Functions

- **Constructor**
  - [interaction/0](#interaction0)

```javascript
import {response} from "@onflow/response"

const res = response()
```
