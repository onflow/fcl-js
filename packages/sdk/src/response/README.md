# Response

This module provides an ADT (Abstract Data Type) that represents the underlying data returned from the send function.

# Status

- **Last Updated:** April 23rd 2021
- **Stable:** Yes
- **Risk of Breaking Change:** Low

Fairly Stable, nothing all that much here. Other modules sort of force this ones hands, because javascript.

# Install

```bash
npm install --save @onflow/sdk
```

{
    "tag":null,
    "transaction":null,
    "transactionStatus":null,
    "transactionId":null,
    "encodedData":null,
    "events":null,
    "account":null,
    "block":null,
    "blockHeader":null,
    "latestBlock":null,
    "collection":null
}

## Internal Properties

> The response is a monomorphic data structure. It has fields for each of the possible data that can be returned from the AccessAPI. The response tag corresponds to the tag of the interaction that generated the response.

- **tag** _(all)_ `int` -- a marker that represents the type of the response. See @onflow/interaction for information on the possible tag values.
- **transaction** _GetTransactionStatus_ -- The response from a GetTransactionStatus requrest.
  - **script** `string` -- The Cadence code used to execute this transaction
  - **args** `Array<string>` -- The arguments passed in to the transaction
  - **referenceBlockId** `string` -- The reference block id for this transaction
  - **gasLimit** -- The gas limit for the transaction
  - **proposalKey** `Key`
    - **sequenceNumber** - Sequence number of key used by the proposer of this transaction
    - **keyId** - The ID of the key in the account used by the proposer of this transaction
    - **address** - The address of the proposer of this transaction
  - **payer** `string` -- Address of the payer of the transaction
  - **proposer** `string` -- Address of the proposer of this transaction
  - **authorizers** `Array<string>` -- Array of addresses of authorizers of this transaction
  - **payloadSignatures** `Array<Signature>` -- The payload signatures for the transaction
    - **sequenceNumber** `string` -- Sequence number of the key used to perform this signature
    - **keyId** `number` -- ID of the key in the account used to perform this signature
    - **signature** `string` -- The signature
  - **envelopeSignatures** `Array<Signature>` -- The envelope signtaures for the transaction
    - **sequenceNumber** `string` -- Sequence number of the key used to perform this signature
    - **keyId** `number` -- ID of the key in the account used to perform this signature
    - **signature** `string`-- The signature
- **transactionStatus** _GetTransactionStatus_ -- The response from a GetTransactionStatus requrest.
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
- **block** _GetBlock_ -- The block retured from a GetBlock* request
  - **id** `string` -- ID of the block
  - **parentId** `string` -- Parent ID of the block
  - **height** `number` -- Height of the block
  - **timestamp** `string` -- ISO timestamp of the block
  - **collectionGuarantees** `Array<CollectionGuarantee`
    - **collectionId** `string` -- ID of the collection
    - **signatures** `string` -- Signatures in the collection
  - **blockSeals**
    - **blockId** `string` -- ID of the block
    - **executionReceiptId** `string` -- ID of the execution receipt
    - **executionReceiptSignatures** `Array<string>` -- Execution receipt signatures
    - **resultApprovalSignatures** `Array<string>` -- Result approval signatures
  - **signatures** `Array<string>` -- Signatures included in this block
- **blockHeader** _GetBlockHeader_  -- The block header returned from a GetBlockHeader request.
  - **id** `string` -- ID of the block
  - **parenId** `string` -- Parent ID of the block
  - **height** `number` -- Height of the block
  - **timestamp** `string` -- ISO timestamp of the block
- **DEPRECATED: latestBlock**  _GetLastestBlock_  -- The block returned from a GetLatestBlock request. **DEPRECATED**
  - **id** `string` -- ID of the block
  - **parentId** `string` -- Parent ID of the block
  - **height** `number` -- Height of the block
  - **timestamp** `string` -- ISO timestamp of the block
  - **collectionGuarantees** `Array<CollectionGuarantee`
    - **collectionId** `string` -- ID of the collection
    - **signatures** `string` -- Signatures in the collection
  - **blockSeals**
    - **blockId** `string` -- ID of the block
    - **executionReceiptId** `string` -- ID of the execution receipt
    - **executionReceiptSignatures** `Array<string>` -- Execution receipt signatures
    - **resultApprovalSignatures** `Array<string>` -- Result approval signatures
  - **signatures** `Array<string>` -- Signatures included in this block
- **collection** _GetCollection_ -- The collection returned from a GetCollection request
  - **id** `string` -- ID of the collection
  - **transactionIds** `Array<string>` -- The ids of transactions included in the collection

## Exposed Functions

- **Constructor**
  - [response/0](#response0)

```javascript
import {response} from "@onflow/response"

const res = response()
```
