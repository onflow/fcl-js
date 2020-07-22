# template

Utility to help with string interop in SDK and FCL

## Usage

```javascript
import {templar} from "onflow/template"

const template = templar`
From: ${o => o.from}
To: ${o => o.to}
Message: ${o => o.msg}
`

const letter = template({
  from: "Bob the Builder",
  to: "Postman Pat",
  msg: "Please pick up your black and white cat.",
})

// prettier-ignore
assert( letter, `
From: Bob the Builder
To: Postman Pat
Message: Please pick up your black and white cat.
`)
```

```javascript
import {templar} from "@onflow/template"

const template1 = templar`
a: ${o => o.a}
b: ${o => o.b}
`

const template2 = templar`
x: ${o => o.x}
y: ${o => o.y}
`

const template3 = templar`
${template1}
${template2}
oh hello!
${template1}
${template2}
`

const rawr = template3({a: "A", b: "B", x: "X", y: "Y"})

// prettier-ignore
assert(rawr, `
a: A
b: B
x: X
y: Y
oh hello!
a: A
b: B
x: X
y: Y
`)
```

## Examples

**Role your own graphql libary**

```javascript
// gql.js
import {templar} from "@onflow/template"

export const gql = templar

export const gqlr = (...args) => (opts = {}) => {
  const params = opts.params || {}
  const headers = opts.headers || {}
  const endpoint = opts.endpoint || ""

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      query: gql(...args)(params),
    }),
  }).then(d => d.json())
}

// somewhere-else.js
import React, {useEffect, useState} from "react"
import {gqlr, gql} from "./gql"

const USER = gql`
  fragment USER on User {
    username
  }
`

const query = gqlr`
  query {
    me { ...USER }
  }
  ${USER}
`

export const Username = () => {
  const [username, setUsername] = useState(null)

  useEffect(() => {
    query({
      endpoint: "http://...",
      headers: {authorization: "bearer ..."},
    }).then(response => setUsername(response.data.me.username))
  }, [])

  return username == null ? null : username
}
```

**Role your own pipeline thing?**

```javascript
const pipe = (fns = []) => token => {
  return fns.reduce((token, fn) => fn(token), token)
}

const param = (key, value) => token => {
  token.params = token.parms || {}
  token.params[key] = value
  return token
}

const script = (...args) => token => {
  token.type = "script"
  token.value = templar(...args)(token.params)
  return token
}

const query = (...args) => token => {
  token.type = "query"
  token.value = templar(...args)(token.parms)
  return token
}

const desc = (...args) => token => {
  token.description = templar(...args)(token.params)
  return token
}

const rawr = pipe([
  param("msg", "woot woot im a boot"),
  script`
    pub fun main() {
      log("msg: ${o => o.msg}")
    }
  `,
  desc`
    the message: ${o => o.msg}
  `,
])

assert(rawr, {
  params: {
    msg: "woot woot im a boot",
  },
  type: "script",
  code: `
    pub fun main() {
      log("msg: woot woot im a boot")
    }
  `,
  descrition: `
    the message: woot woot im a boot
  `,
})
```
