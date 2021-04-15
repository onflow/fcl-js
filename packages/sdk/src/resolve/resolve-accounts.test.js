import {
  build,
  resolve,
  ref,
  transaction,
  proposer,
  payer,
  limit,
  meta,
  authorizations,
  authorization,
} from "../sdk.js"
import {buildPreSignable} from "./resolve-accounts"

const META = {
  title: "Kitty Kangol",
  description: "A cool cat hat",
  price: "10",
  image: "https://i.imgur.com/a/JPmBk9R.png",
}

test("meta in resolve-accounts", async () => {
  const ix = await resolve(
    await build([
      transaction``,
      limit(156),
      proposer(authorization("01", () => ({signature: "123"}), 1, 123)),
      authorizations([authorization("01", () => ({signature: "123"}), 1, 123)]),
      payer(authorization("01", () => ({signature: "123"}), 1, 123)),
      ref("123"),
      meta(META),
    ])
  )

  expect(ix.metadata).toStrictEqual(META)
})

const IX = {
  proposer: "ba1132bc08f82fe2|1",
  authorizations: ["ba1132bc08f82fe2|1"],
  payer: "f086a545ce3c552d|18",
  metadata: META,
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
      payer(authz),
      ref("123"),
      meta(META),
    ])
  )

  const ps = buildPreSignable(ix.accounts[ix.proposer], ix)

  expect(ps.voucher).toEqual({
    cadence: "",
    refBlock: "123",
    computeLimit: 156,
    arguments: [],
    proposalKey: {address: "0x01", keyId: 1, sequenceNum: 123},
    payer: "0x01",
    authorizers: ["0x01"],
    payloadSigs: [
      {address: "0x01", keyId: 1, sig: "123"},
      {address: "0x01", keyId: 1, sig: "123"},
    ],
  })
})
