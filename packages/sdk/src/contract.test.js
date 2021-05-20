import * as root from "./sdk"
import * as decode from "./decode/decode.js"
import * as encode from "./encode/encode.js"
import * as interaction from "./interaction/interaction.js"
import * as send from "./send/send.js"
import * as template from "@onflow/util-template"

const interfaceContract = (label, wat) => ([template]) => {
  const keys = template.replace(/\s+/g, "|").split("|").filter(Boolean)

  describe(label, () => {
    for (let key of keys)
      test(`${label}.${key}`, () =>
        expect(wat[key]).toStrictEqual(expect.any(Function)))
  })
}

interfaceContract("export", root)`
  build resolve send
  decode
  isOk isBad why pipe
  getAccount getEvents getLatestBlock getTransactionStatus
  authorizations authorization
  params param
  proposer payer
  ping script transaction
  limit ref
  resolveAccounts
  resolveSignatures
`

describe("consume", () => {
  interfaceContract("@onflow/decode", decode)`
    decode
    decodeResponse
  `

  interfaceContract("@onflow/encode", encode)`
    encodeTransactionPayload
    encodeTransactionEnvelope
  `

  interfaceContract("@onflow/interaction", interaction)`
    interaction
    pipe Ok isOk isBad why
    put get update
    makeGetAccount makeGetEvents makeGetLatestBlock
    makeGetTransactionStatus makePing
    makeScript makeTransaction
    isTransaction isScript
  `

  interfaceContract("@onflow/send", send)`
    send
  `

  interfaceContract("@onflow/util-template", template)`
    template
  `
})
