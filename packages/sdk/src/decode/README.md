> **NOTE:** Requires a Buffer polyfill

# Decode

This package provides methods that can decode a response, which can include JSON-CDC payloads from the Access API into JavaScript friendly types.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change**: Extremely Low (If the known upcoming change is taken into account)

This package is fairly stable, might even be the most complete package we have.
We are fairly happy with how it is consumed, and how it works internally.
Other than the known upcoming change listed below this package might be ready for its first major version bump.

# Install

```bash
npm install --save @onflow/sdk
```

# Usage

**Decoding without ABIs**

Unlike with other blockchains, Flow does not require the use of an ABI to decode responses from the blockchain! A response from the Flow Access Node is encoded in JSON-CDC, which is a self describing payload that this package uses to decode the response into JavaScript friendly types.

**Decoding**

You can use `decodeResponse` on any type of response. If that response includes a JSON-CDC payload, it will be decoded into JavaScript friendly types. The data that is returned from `decodeResponse` is the data received from the Access Node for the sent interaction.

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
