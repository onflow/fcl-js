### Unreleased

- YYYY-MM-DD **BREAKING?** -- description

### 0.0.7 -- 2020-08-25

- 2020-08-25 -- Deprecates operating upon data from the latestBlock field of the response object.
- 2020-08-24 -- Updates decode to decode GetLatestBlock, GetBlockByHeight and GetBlockByHeight responses.
- 2020-08-19 -- Updtates UFix64 and Fix64 types to now decode into Strings.

### 0.0.6 -- 2020-05-04

- 2020-04-27 **BREAKING** -- `decodeResponse` now parses JSON-CDC, if present, from a response, and returns the appropriate populated data from the response.
- 2020-04-23 **BREAKING** -- No longer parse JSON-CDC data from Uint8Array in decodeResponse since this step is now performed in send.

### 0.0.5 -- 2020-04-20

- 2020-04-20 **BREAKING** -- Only export `decode` and `decodeResponse`
- 2020-04-20 -- Removed dependency for `@onflow/bytes`

### 0.0.4 -- 2020-04-18

- 2020-04-18 -- VSN bytes 0.0.1 -> 0.0.2

### 0.0.3 -- 2020-04-18

- 2020-04-18 -- VSN jest 25.1.0 -> 25.3.0
- 2020-04-18 -- VSN microbundle 0.11.0 -> 0.12.0-next.8

### 0.0.2 -- 2020-04-17

- Pre Changelog
