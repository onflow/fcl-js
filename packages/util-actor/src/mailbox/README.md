### Mailbox

> An async first-in/first-out queue, used to enforce order of the actors.

```javascript
import {mailbox} from "..."

const m = mailbox()

m.deliver("foo")
m.deliver("bar")
m.deliver("baz")

await m.receive() // "foo"
await m.receive() // "bar"
await m.receive() // "baz"
```
