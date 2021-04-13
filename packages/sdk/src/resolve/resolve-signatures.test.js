import {resolveSignatures, buildSignable} from "./resolve-signatures.js"

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
      addr: "foo",
      keyId: 0,
      sequenceNum: 0,
      signingFunction: signingFunction,
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
  const ix = await resolveSignatures(TRANSACTION)

  const signable = buildSignable(ix.accounts.foo, "message", ix)

  expect(signable.voucher).toEqual(ix.message)
})

test("Golden Path", async () => {
  const ix = await resolveSignatures(TRANSACTION)

  expect(ix).toMatchSnapshot()
})
