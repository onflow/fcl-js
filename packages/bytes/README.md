> **NOTE:** Requires a Buffer polyfill

# @onflow/bytes
This package provides helper functions around the interanal bytes data structure used throughout the Flow JS SDK.

# Install

```bash
npm install --save @onflow/bytes
```

# Usage

**Creating a byte array**

```javascript
import { bytes } from "@onflow/bytes"

const bytesFromHexString = bytes("123")
const bytesFromHexStringWithPadding = bytes("123", 20)
const bytesFromUint8Array = bytes(new Uint8Array())
```

**Bytes Utilities**

```javascript
import {bytesToString} from "@onflow/bytes"
const utf8StringFromBytes = bytesToString(bytes)

import {bytesToHex} from "@onflow/bytes"
const hexStringFromBytes = bytesToHex(bytes)

import {bytesToBuffer} from "@onflow/bytes"
const bufferFromBytes = bytesToBuffer(bytes)
```

```javascript
import {addressToBuffer} from "@onflow/bytes"
const bufferFromAddress = addressToBuffer("01")

import {scriptToBuffer} from "@onflow/bytes"
const bufferFromScript = scriptToBuffer("My Cadence Script")

import {keyToBuffer} from "@onflow/bytes"
const bufferFromKey = keyToBuffer("my-public-key")

import {hashToBuffer} from "@onflow/bytes"
const bufferFromHash = hashToBuffer("my-fun-hash")

import {bufferToHexString} from "@onflow/bytes"
const hexStringFromBuffer = bufferToHexString(buffer)
```
