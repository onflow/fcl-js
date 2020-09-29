```javascript

import {withPrefix, sansPrefix, display} from "@onflow/util-address"

const address = "0xc88ff43f1a87c679"
assert(sansPrefix(address), "c88ff43f1a87c679")

assert(withPrefix(address), address)
assert(withPrefix(sansPrefix(address)), address)

const Comp = ({ address }) => {
  return <div>
    <strong>Flow Address</strong>
    <span>{display(address)}</span>
  </div>
}

```
