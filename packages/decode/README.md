> **NOTE:** Requires a Buffer polyfill

# @onflow/bytes
This package provides methods that can decode a JSON-CDC payload from the AccessAPI into a JavaScript friendly types.

# Install

```bash
npm install --save @onflow/decode
```

# Usage

**Decoding a Response**

```javascript
import { decodeResponse } from "@onflow/decode"
const decoded = await decodeResponse(myResponse)
```

**Decoding a Response, with a Custom Decoder**

A Custom Decoder is a way for users to define how to decode certain encoded types from the AccessAPI

```javascript
import { decodeResponse } from "@onflow/decode"
const decoded = await decodeResponse(myResponse, {
    "UInt8": (data) => Number(data)
})
```

**Decoding a Response, with a Custom Decoder for a Resource**

A Custom Decoder is a way for users to additionally define how to decode Resources.

```javascript
import { decodeResponse } from "@onflow/decode"
const decoded = await decodeResponse(myResponse, {
    "CryptoKitty": (cryptoKitty) => ({
        name: cryptoKitty.kittyName || "Lil BUB The Magical Space Cat",
    })
})
```

**Decoding a Response, with a Custom Decoder using Regex Lookup**

You can specify Custom Decoders to be executed on types tested against with a Regex expression.
To denote a Regex expression, write the key for that custom decoder between two slashes. Note that
only global search is suppoted at this time.

```javascript
import { decodeResponse } from "@onflow/decode"
const decoded = await decodeResponse(myResponse, {
    "/.CryptoKitty$/": myCryptoKittyDecoder
})
```

**Decoding a JSON-CDC payload**

You can additionally directly deocde a JSON-CDC payload.

```javascript
import { decode } from "@onflow/decode"

const jsonCDC = { type: "String", value: "https://discordapp.com/invite/WgAQhtB" }

const decoded = await deocde(jsonCDC)

expect(decoded).toStrictEqual("https://discordapp.com/invite/WgAQhtB")
```
