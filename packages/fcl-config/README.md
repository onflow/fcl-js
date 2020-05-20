# @onflow/fcl-config

Recursively searches synchronously for a `flow.json` file, starting in the execution context moving towards the home directory inclusively.

# Install

```bash
npm install --save @onflow/fcl-config
```

# Usage

```javascript
import {flowConfig} from "@onflow/fcl-config"
const config = flowConfig() // javascript object if found, error if not found
```
