### Unreleased

- YYYY-MM-DD **BREAKING?** -- description

### 0.0.10 -- 2020-12-11

- 2020-12-11 -- VSN `@onflow/resolve` 0.0.10
- 2020-12-11 -- VSN `@onflow/send` 0.0.35

### 0.0.[6..9] -- 2020-12-03

- 2020-12-03 -- VSN `@onflow/sdk-resolve` 0.0.9
- 2020-12-03 -- VSN `@onflow/send` 0.0.34

### 0.0.5 -- 2020-11-17

- 2020-11-17 -- Includes updated lock file

### 0.0.4 -- 2020-11-17

- 2020-11-17 -- Globally Injectable Send and Resolve Function as Config
- 2020-11-17 -- Injectable Send and Resolve Function as Option

> Notes

```javascript
// As Config
import {config} from "@onflow/config"

config()
  .put("sdk.resolve", async ix => ix)
  .put("sdk.send", async ix => console.log(ix))

await send([getAccount("0x1d007d755706c469")])

// As Options
const opts = {
  resolve: async ix => ix,
  send: async ix => console.log(ix),
}

await send([getAccount("0x1d007d755706c469")], opts)
```

### 0.0.3 -- 2020-11-04

- 2020-10-28 -- VSN `@onflow/sdk-resolve` 0.0.3 -> 0.0.4

### 0.0.2 -- 2020-10-28

- 2020-10-28 -- VSN `@onflow/sdk-resolve` 0.0.2 -> 0.0.3

### 0.0.1 -- 2020-10-28

- 2020-10-28 -- VSN `@onflow/sdk-resolve` 0.0.0 -> 0.0.2

### 0.0.0 -- 2020-10-08

- 2020-10-07 -- Initial port from fcl.
