# @onflow/response

> This module provides an ADT (Abstract Data Type) that represents the underlying data returned from the `send` function.

# Install

```bash
npm install --save @onflow/response
```

{"tag": 0, "transaction":null, "transactionHash":null, "encodedData":null, "decodeInstructions": null, "events": null, "account": null, "ping": null}'

## Internal Properties

> The response is a monomorphic data structure. It has fields for each of the possible data that can be returned from the AccessAPI. The response tag corresponds to the tag of the interaction that generated the response.

- **tag** *(all)* `Int` -- a marker that represents the type of the response. See @onflow/interaction for information on the possible tag values.
- **transaction** *GetTransactionStatus* -- The response from a GetTransactionStatus requrest.
- **transactionId** *Transaction* -- The id of the transaction executed during a Transaction request.
- **encodedData** *ExecuteScript* -- The encoded JSON-CDC data returned from a ExecuteScript request.
- **events** *GetEvents* -- The events returned from a GetEvents request.
- **account** *GetAccount* -- The account returned from a GetAccount request.

## Exposed Functions

- **Constructor**
  - [interaction/0](#interaction0)

```javascript
import { response } from "@onflow/response"

const res = response()
```
