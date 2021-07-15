import {
  build,
  resolve,
  ref,
  transaction,
  proposer,
  payer,
  limit,
  authorizations,
  authorization,
} from "../sdk.js"
import {buildPreSignable} from "./resolve-accounts"

const IX = {
  proposer: "ba1132bc08f82fe2|1",
  authorizations: ["ba1132bc08f82fe2|1"],
  payer: "f086a545ce3c552d|18",
  message: {
    cadence: "",
    refBlock: "123",
    computeLimit: 156,
    proposer: null,
    payer: null,
    authorizations: [],
    params: [],
    arguments: [],
  },
}

test("Voucher in PreSignable", async () => {
  const authz = {
    addr: "0x01",
    signingFunction: () => ({signature: "123"}),
    keyId: 1,
    sequenceNum: 123,
  }
  const ix = await resolve(
    await build([
      transaction``,
      limit(156),
      proposer(authz),
      authorizations([authz]),
      payer({
        addr: "0x02",
        signingFunction: () => ({signature: "123"}),
        keyId: 0,
        sequenceNum: 123,
      }),
      ref("123"),
    ])
  )

  const ps = buildPreSignable(ix.accounts[ix.proposer], ix)

  expect(ps.voucher).toEqual({
    cadence: "",
    refBlock: "123",
    computeLimit: 156,
    arguments: [],
    proposalKey: {address: "0x01", keyId: 1, sequenceNum: 123},
    payer: "0x02",
    authorizers: ["0x01"],
    payloadSigs: [
      {address: "0x01", keyId: 1, sig: "123"},
      {address: "0x01", keyId: 1, sig: "123"},
    ],
    envelopeSigs: [{address: "0x02", keyId: 0, sig: "123"}],
  })
})
