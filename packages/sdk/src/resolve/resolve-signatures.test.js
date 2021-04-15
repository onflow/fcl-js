import {resolveSignatures, buildSignable} from "./resolve-signatures.js"
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

const META = {
  title: "Kitty Kangol",
  description: "A cool cat hat",
  price: "10",
  image: "https://i.imgur.com/a/JPmBk9R.png",
}

const signingFunction = jest.fn(() => ({
  addr: "foo",
  keyId: 0,
  signature: "SIGNATURE",
}))

const TRANSACTION = {
  tag: "TRANSACTION",
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
  accounts: {
    foo: {
      kind: "ACCOUNT",
      tempId: "foo",
      addr: "foo",
      keyId: 1,
      sequenceNum: 123,
      signature: null,
      signingFunction: signingFunction,
      resolve: null,
      role: {proposer: false, authorizer: false, payer: true, param: false},
    },
  },
  proposer: "foo",
  authorizations: ["foo"],
  payer: "foo",
  metadata: META,
}

test("exports function", () => {
  expect(typeof resolveSignatures).toBe("function")
})

test("meta in signable", async () => {
  const ix = await resolveSignatures(TRANSACTION)

  const signable = buildSignable(ix.accounts.foo, "message", ix)

  expect(signable.metadata).toEqual(ix.metadata)
})

test("voucher in signable", async () => {
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

  const signable = buildSignable(ix.accounts[ix.proposer], {}, ix)

  expect(signable.voucher).toEqual({
    cadence: "",
    refBlock: "123",
    computeLimit: 156,
    arguments: [],
    proposalKey: {address: "01", keyId: 1, sequenceNum: 123},
    payer: "01",
    authorizers: ["01"],
    payloadSigs: [
      {address: "01", keyId: 1, sig: "123"},
      {address: "01", keyId: 1, sig: "123"},
    ],
  })
})

test("Golden Path", async () => {
  const ix = await resolveSignatures(TRANSACTION)

  expect(ix).toMatchSnapshot()
})
