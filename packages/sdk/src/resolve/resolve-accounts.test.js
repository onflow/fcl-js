import {
  build,
  resolve,
  ref,
  transaction,
  proposer,
  payer,
  limit,
  authorizations,
} from "../sdk.js"
import {buildPreSignable} from "./resolve-accounts"

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
        tempId: "payerAcct",
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

test("Voucher in PreSignable multiple payer keys", async () => {
  const authz = {
    addr: "0x01",
    tempId: "0x01-1",
    signingFunction: () => ({signature: "123"}),
    keyId: 1,
    sequenceNum: 123,
  }

  const authzPayer = {
    addr: "0x02",
    address: "0x02",
    resolve: (account, preSignable) => [
      {
        ...account,
        tempId: "0x02-0",
        addr: "0x02",
        keyId: 0,
        sequenceNum: 123,
        signingFunction: signable => ({
          signature: "123",
          addr: "0x02",
          keyId: 0,
        }),
      },
      {
        ...account,
        tempId: "0x02-1",
        addr: "0x02",
        keyId: 1,
        sequenceNum: 123,
        signingFunction: signable => ({
          signature: "333",
          addr: "0x02",
          keyId: 1,
        }),
      },
    ],
  }

  const built = await build([
    transaction``,
    limit(156),
    proposer(authz),
    authorizations([authz]),
    payer(authzPayer),
    ref("123"),
  ])

  const ix = await resolve(built)
  expect(ix.payer).toEqual(["0x02-0", "0x02-1"])

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
    envelopeSigs: [
      {address: "0x02", keyId: 0, sig: "123"},
      {address: "0x02", keyId: 1, sig: "333"},
    ],
  })
})

test("Voucher in PreSignable multiple payer keys different accounts", async () => {
  const authz = {
    addr: "0x01",
    tempId: "0x01-1",
    signingFunction: () => ({signature: "123"}),
    keyId: 1,
    sequenceNum: 123,
  }

  const authzPayer = {
    addr: "0x02",
    address: "0x02",
    resolve: (account, preSignable) => [
      {
        ...account,
        tempId: "0x02-0",
        addr: "0x02",
        keyId: 0,
        sequenceNum: 123,
        signingFunction: signable => ({
          signature: "123",
          addr: "0x02",
          keyId: 0,
        }),
      },
      {
        ...account,
        tempId: "0x01-1",
        addr: "0x01",
        keyId: 1,
        sequenceNum: 123,
        signingFunction: signable => ({
          signature: "333",
          addr: "0x02",
          keyId: 1,
        }),
      },
    ],
  }

  const built = await build([
    transaction``,
    limit(156),
    proposer(authz),
    authorizations([authz]),
    payer(authzPayer),
    ref("123"),
  ])

  await expect(resolve(built)).rejects.toThrow()
})
