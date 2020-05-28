const INTERACTION = `{
  "tag":"UNKNOWN",
  "assigns":{},
  "status":"OK",
  "reason":null,
  "accounts":{},
  "params":{},
  "message": {
    "cadence":null,
    "refBlock":null,
    "computLimit":null,
    "proposer":null,
    "payer":null,
    "authorizations":[],
    "params":[]
  },
  "proposer":null,
  "authorizations":[],
  "payer":null,
  "events": {
    "eventType":null,
    "start":null,
    "end":null
  },
  "latestBlock": {
    "isSealed":null
  },
  "accountAddr":null,
  "transactionId":null
}`

exports.param = function interaction() {
  return JSON.parse(INTERACTION)
}
