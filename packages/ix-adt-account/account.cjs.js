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

exports.account = function account() {
  return JSON.parse(ACCOUNT)
}
