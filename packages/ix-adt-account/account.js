/// <reference types="./types.d.ts" />
const ACCOUNT = `{
  "kind":"ACCOUNT",
  "tempId":null,
  "addr":null,
  "keyId":null,
  "sequenceNum":null,
  "signature":null,
  "signingFunction":null,
  "resolve":null,
  "roles": {
    "proposer":false,
    "authorizer":false,
    "payer":false,
    "param":false
  }
}`

export function account() {
  return JSON.parse(ACCOUNT)
}
