# Encode Key

Encodes public keys so that the Flow Blockchain can use them.

You can learn more about keys, curves, hashes, weights and signing here: https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms

```javascript
import { template as addNewKey } from "@onflow/six-add-new-key"
import * as fcl from "@onflow/fcl"

import {encodeKey, ECDSA_P256, SHA3_256} from "@onflow/util-encode-key"

// The key you want to use to sign transactions later
const PUBLIC_KEY = "0bfcd8790c3ce88f3fac9d4bd23514f48bf0cdd1f6c3c8bdf87b11489b1bbeca1ef805ec2ee76451e9bdb265284f78febaeacbc8b0827e0a7baafee4e655d0b5"

const ENCODED_KEY = encodeKey(
  PLUBLIC_KEY, // The key to encode (DER Hex)
  ECDSA_P256,  // The curve Flow needs to use with your key [ECDSA_P256|ECDSA_secp256k1]
  SHA3_256,    // The hashing algorythm Flow needs to use with your key [SHA2_256|SHA3_256]
  1000         // The weight you want this key to have [Range: 0..1000]
)

const authz = fcl.currentUser().authorization

const resp = await fcl.send([
  addNewKey({
    publicKey: [ENCODED_KEY],
    proposer: authz,
    payer: authz,
    authorization: authz
  })
])

```

