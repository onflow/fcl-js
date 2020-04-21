> **NOTE:** Requires a Buffer polyfill

# @onflow/decode

This package provides methods that can decode a JSON-CDC payload from the Access API into JavaScript friendly types.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change**: Extremely Low (If the known upcoming change is taken into account)

This package is fairly stable, might even be the most complete package we have.
We are fairly happy with how it is consumed, and how it works internally.
Other than the known upcoming change listed below this package might be ready for its first major version bump.

Known Upcoming Changes:

- `decodeResponse` currently unpacks the JSON-CDC from a hex representation. We will be moving this responsiblity into `@onflow/send` so that `decode` can be passed `response.encodedData` directly.

# Install

```bash
npm install --save @onflow/decode
```

# Usage

**Decoding a Response**

```javascript
import {decodeResponse} from "@onflow/decode"
const decoded = await decodeResponse(myResponse)
```

**Decoding a Response, with a Custom Decoder**

A Custom Decoder is a way for users to define how to decode certain encoded types from the Access API

```javascript
import {decodeResponse} from "@onflow/decode"
const decoded = await decodeResponse(myResponse, {
  UInt8: data => Number(data),
})
```

**Decoding a Response, with a Custom Decoder for a Resource**

A Custom Decoder is a way for users to additionally define how to decode Resources.

```javascript
import {decodeResponse} from "@onflow/decode"
const decoded = await decodeResponse(myResponse, {
  CryptoKitty: cryptoKitty => ({
    name: cryptoKitty.kittyName || "Lil BUB The Magical Space Cat",
  }),
})
```

**Decoding a Response, with a Custom Decoder using Regex Lookup**

You can specify Custom Decoders to be executed on types tested against with a regular expression.
To denote a regular expression, write the key for that custom decoder between two slashes. Note that
only global search is suppoted at this time.

```javascript
import {decodeResponse} from "@onflow/decode"
const decoded = await decodeResponse(myResponse, {
  "/.CryptoKitty$/": myCryptoKittyDecoder,
})
```

**Decoding a JSON-CDC payload**

You can additionally directly decode a JSON-CDC payload.

```javascript
import {decode} from "@onflow/decode"

const jsonCDC = {type: "String", value: "https://discordapp.com/invite/WgAQhtB"}

const decoded = await deocde(jsonCDC)

expect(decoded).toStrictEqual("https://discordapp.com/invite/WgAQhtB")
```
