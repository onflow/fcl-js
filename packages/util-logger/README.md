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
