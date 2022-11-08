const DEFAULT_RESPONSE = `{
    "tag":null,
    "transaction":null,
    "transactionStatus":null,
    "transactionId":null,
    "encodedData":null,
    "events":null,
    "account":null,
    "block":null,
    "blockHeader":null,
    "latestBlock":null,
    "collection":null
}`

export const response = () => JSON.parse(DEFAULT_RESPONSE)
