# @onflow/response

> This module provides an ADT (Abstract Data Type) that represents the underlying data returned from the send function.

# Install

```bash
npm install --save @onflow/response
```

{"tag": 0, "transaction":null, "transactionId":null, "encodedData":null, "events": null, "account": null}'

## Internal Properties

> The response is a monomorphic data structure. It has fields for each of the possible data that can be returned from the AccessAPI. The response tag corresponds to the tag of the interaction that generated the response.

- **tag** *(all)* `int` -- a marker that represents the type of the response. See @onflow/interaction for information on the possible tag values.
- **transaction** *GetTransactionStatus* -- The response from a GetTransactionStatus requrest.
  - **status** `int` -- The status of the transaction
  - **statusCode** `int` -- The status code of the transaction
  - **errorMessage** `string` -- The error message of the transaction
  - **events** `Array<Event>` -- The events for this result
      - **type** `string` -- The type of this event
      - **transactionId** `int` -- The transactionId of this event
      - **transactionIndex** `int` -- The transactionIndex of this event
      - **eventIndex** `int` -- The index of this event
      - **payload** `Uint8Array` -- The encoded JSON-CDC payload of this event.
- **transactionId** *Transaction* `string` -- The id of the transaction executed during a Transaction request.
- **encodedData** *ExecuteScript* `Uint8Array` -- The encoded JSON-CDC data returned from a ExecuteScript request.
- **events** *GetEvents* -- The events returned from a GetEvents request.
  - **results** `Array<Result>` -- The results returned from a GetEvents request.
    - **blockId** `int` -- The block id of this result
    - **blockHeight** `int` -- The block height of this result
    - **events** `Array<Event>` -- The events for this result
      - **type** `string` -- The type of this event
      - **transactionId** `int` -- The transactionId of this event
      - **transactionIndex** `int` -- The transactionIndex of this event
      - **eventIndex** `int` -- The index of this event
      - **payload** `Uint8Array` -- The encoded JSON-CDC payload of this event.
- **account** *GetAccount* -- The account returned from a GetAccount request.
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
import { response } from "@onflow/response"

const res = response()
```
