# template

String utilities for use throughout FCL and JS-SDK

## Install

```javascript
npm install --save @onflow/util-transform-string
```

## Usage

```javascript

import {
    utf8_to_base64,
    base64_to_utf8,
} from "../util-string.js"

const test_string = "Flow Blockchain"

expect(
    base64_to_utf8(
        utf8_to_base64(test_string)
    )
).toEqual(
    test_string
)
```
