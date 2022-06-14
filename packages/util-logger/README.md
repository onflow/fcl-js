# @onflow/util-logger

Logger for FCL-JS.

# Status

- **Last Updated:** March 30 2022
- **Stable:** Yes
- **Risk of Breaking Change:** No

# Install

```bash
npm install --save @onflow/util-logger
```

# Usage

## Logger Levels

| Name    | Value |
| ------- | ----- |
| `error` |   1   |
| `warn`  |   2   |
| `log`   |   3   |
| `info`  |   4   |
| `debug` |   5   |

```javascript
import * as logger from "@onflow/util-logger"

// This will fire if the config "logger.level" value is set to the error level or above
logger.log({
  title: "Title of error", 
  message: "Message body", 
  level: logger.LEVELS.error
})
```

## Deprecation

This package also exposes a useful method for logging deprecation warnings via `log.deprecate`.  The function accepts an object with the following keys as its parameters.

 - `pkg` (optional) - The package which the deprecated feature belongs to (i.e. `FCL/SDK`, `@onflow/util-invariant`, etc.).  If not provided it defaults to an empty string and will not show in the notice.
 - `subject` (optional) - The feature that is being deprecated (i.e. `"Passing a start and end into getEvents"`).
 - `transition`  (optional) - The URL to the transition guide for the deprecation
 - `level` (optional) - The [logger level](https://github.com/onflow/fcl-js/tree/master/packages/util-logger#logger-levels) of the deprecation notice (default LEVELS.warn)
 - `message` (optional) - An additional message to provide the user about the deprecation.  Will ap
 - `callback` (optional) -

Deprecation notice format:
```javascript
 `${pkg} Deprecation Notice
============================

${subject} is deprecated and will cease to work in future releases of ${pkg}.
${message}
You can learn more (including a guide on common transition paths) here: ${transition}

============================`
```
The lines with `subject`, `message`, and `transition` will not appear if these values are not provided.  
  
Example usage:
```javascript
import * as logger from "@onflow/util-logger"

logger.log.deprecate({
  pkg: "FCL/SDK",
  subject: "Passing a start and end into getEvents",
  transition:
    "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0005-deprecate-start-end-get-events-builder",
})
```
