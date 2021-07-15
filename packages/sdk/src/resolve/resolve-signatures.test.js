import {resolveSignatures, buildSignable} from "./resolve-signatures.js"
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
}

test("exports function", () => {
  expect(typeof resolveSignatures).toBe("function")
})

test("voucher in signable", async () => {
  const authz = {
    addr: "0x01",
    signingFunction: () => ({signature: "123"}),
    keyId: 0,
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

  const signable = buildSignable(ix.accounts[ix.proposer], {}, ix)

  expect(signable.voucher).toEqual({
    cadence: "",
    refBlock: "123",
    computeLimit: 156,
    arguments: [],
    proposalKey: {address: "0x01", keyId: 0, sequenceNum: 123},
    payer: "0x02",
    authorizers: ["0x01"],
    payloadSigs: [
      {address: "0x01", keyId: 0, sig: "123"},
      {address: "0x01", keyId: 0, sig: "123"},
    ],
    envelopeSigs: [{address: "0x02", keyId: 0, sig: "123"}],
  })
})

test("Golden Path", async () => {
  const ix = await resolveSignatures(TRANSACTION)

  expect(ix).toMatchSnapshot()
})
