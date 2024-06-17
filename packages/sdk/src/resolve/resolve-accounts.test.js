import {
  build,
  resolve,
  ref,
  transaction,
  proposer,
  payer,
  limit,
  authorizations,
} from "../sdk"
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

test("Voucher in PreSignable no authorizers", async () => {
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
    authorizers: [],
    payloadSigs: [{address: "0x01", keyId: 1, sig: "123"}],
    envelopeSigs: [{address: "0x02", keyId: 0, sig: "123"}],
  })
})

test("Voucher in PreSignable multiple payer keys", async () => {
  const authz = {
    addr: "0x01",
    signingFunction: () => ({signature: "123"}),
    keyId: 1,
    sequenceNum: 123,
  }

  const authzPayer = {
    addr: "0x02",
    resolve: (account, preSignable) => [
      {
        ...account,
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

test("mulitple payer scenario (One from dev and one from pre-authz)", async () => {
  const authzPayer = {
    addr: "0x01",
    signingFunction: () => ({signature: "123"}),
    keyId: 1,
    sequenceNum: 123,
  }

  const authz = {
    kind: "ACCOUNT",
    addr: null,
    keyId: null,
    signature: null,
    signingFunction: null,
    resolve: (account, preSignable) => [
      {
        addr: "72f6325947f76d3a",
        sequenceNum: 12,
        signingFunction: () => ({signature: "1"}),
        keyId: 1,
        role: {proposer: true, payer: false, authorizer: false},
      },
      {
        addr: "f086a545ce3c552d",
        signingFunction: () => ({signature: "2"}),
        keyId: 12,
        role: {proposer: false, payer: true, authorizer: false},
      },
      {
        addr: "72f6325947f76d3a",
        sequenceNum: 12,
        signingFunction: () => ({signature: "1"}),
        keyId: 1,
        role: {proposer: false, payer: false, authorizer: true},
      },
    ],
    role: {
      proposer: true,
      authorizer: true,
      payer: false,
      param: false,
    },
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

  const ps = buildPreSignable(ix.accounts[ix.proposer], ix)

  expect(ps.voucher).toEqual({
    cadence: "",
    refBlock: "123",
    computeLimit: 156,
    arguments: [],
    proposalKey: {address: "0x72f6325947f76d3a", keyId: 1, sequenceNum: 12},
    payer: "0x01",
    authorizers: ["0x72f6325947f76d3a"],
    payloadSigs: [{address: "0x72f6325947f76d3a", keyId: 1, sig: "1"}],
    envelopeSigs: [{address: "0x01", keyId: 1, sig: "123"}],
  })
})

test("mulitple payer scenario (One from dev and one from pre-authz) as array", async () => {
  const authzPayer1 = {
    addr: "0x01",
    signingFunction: () => ({signature: "123"}),
    keyId: 1,
    sequenceNum: 123,
  }
  const authzPayer2 = {
    addr: "0x01",
    signingFunction: () => ({signature: "456"}),
    keyId: 2,
    sequenceNum: 456,
  }

  const authz = {
    kind: "ACCOUNT",
    addr: null,
    keyId: null,
    signature: null,
    signingFunction: null,
    resolve: (account, preSignable) => [
      {
        addr: "02",
        sequenceNum: 12,
        signingFunction: () => ({signature: "1"}),
        keyId: 1,
        role: {proposer: true, payer: false, authorizer: false},
      },
      {
        addr: "01",
        signingFunction: () => ({signature: "2"}),
        keyId: 12,
        role: {proposer: false, payer: true, authorizer: false},
      },
      {
        addr: "02",
        sequenceNum: 12,
        signingFunction: () => ({signature: "1"}),
        keyId: 1,
        role: {proposer: false, payer: false, authorizer: true},
      },
    ],
    role: {
      proposer: true,
      authorizer: true,
      payer: false,
      param: false,
    },
  }

  const built = await build([
    transaction``,
    limit(156),
    proposer(authz),
    authorizations([authz]),
    payer([authzPayer1, authzPayer2]),
    ref("123"),
  ])

  const ix = await resolve(built)

  const ps = buildPreSignable(ix.accounts[ix.proposer], ix)

  expect(ps.voucher).toEqual({
    cadence: "",
    refBlock: "123",
    computeLimit: 156,
    arguments: [],
    proposalKey: {address: "0x02", keyId: 1, sequenceNum: 12},
    payer: "0x01",
    authorizers: ["0x02"],
    payloadSigs: [{address: "0x02", keyId: 1, sig: "1"}],
    envelopeSigs: [
      {address: "0x01", keyId: 1, sig: "123"},
      {address: "0x01", keyId: 2, sig: "456"},
    ],
  })
})

test("payer from pre-authz", async () => {
  const authz = {
    kind: "ACCOUNT",
    addr: null,
    keyId: null,
    signature: null,
    signingFunction: null,
    resolve: (account, preSignable) => [
      {
        addr: "72f6325947f76d3a",
        sequenceNum: 12,
        signingFunction: () => ({signature: "1"}),
        keyId: 1,
        role: {proposer: true, payer: false, authorizer: false},
      },
      {
        addr: "f086a545ce3c552d",
        signingFunction: () => ({signature: "2"}),
        keyId: 12,
        role: {proposer: false, payer: true, authorizer: false},
      },
      {
        addr: "72f6325947f76d3a",
        sequenceNum: 12,
        signingFunction: () => ({signature: "1"}),
        keyId: 1,
        role: {proposer: false, payer: false, authorizer: true},
      },
    ],
    role: {
      proposer: true,
      authorizer: true,
      payer: false,
      param: false,
    },
  }

  const built = await build([
    transaction``,
    limit(156),
    proposer(authz),
    authorizations([authz]),
    payer(authz),
    ref("123"),
  ])

  const ix = await resolve(built)

  const ps = buildPreSignable(ix.accounts[ix.proposer], ix)

  expect(ps.voucher).toEqual({
    cadence: "",
    refBlock: "123",
    computeLimit: 156,
    arguments: [],
    proposalKey: {address: "0x72f6325947f76d3a", keyId: 1, sequenceNum: 12},
    payer: "0xf086a545ce3c552d",
    authorizers: ["0x72f6325947f76d3a"],
    payloadSigs: [{address: "0x72f6325947f76d3a", keyId: 1, sig: "1"}],
    envelopeSigs: [{address: "0xf086a545ce3c552d", keyId: 12, sig: "2"}],
  })
})

test("Voucher in PreSignable multiple payer keys and multiple authorizers", async () => {
  const proposerAcc = {
    addr: "0x04",
    signingFunction: () => ({signature: "456"}),
    keyId: 4,
    sequenceNum: 345,
  }
  const authz1 = {
    addr: "0x01",
    signingFunction: () => ({signature: "123"}),
    keyId: 1,
    sequenceNum: 123,
  }
  const authz2 = {
    addr: "0x03",
    signingFunction: () => ({signature: "444"}),
    keyId: 2,
    sequenceNum: 234,
  }

  const authzPayer = {
    addr: "0x02",
    resolve: (account, preSignable) => [
      {
        ...account,
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
    proposer(proposerAcc),
    authorizations([authz1, authz2]),
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
    proposalKey: {address: "0x04", keyId: 4, sequenceNum: 345},
    payer: "0x02",
    authorizers: ["0x01", "0x03"],
    payloadSigs: [
      {address: "0x01", keyId: 1, sig: "123"},
      {address: "0x03", keyId: 2, sig: "444"},
      {address: "0x04", keyId: 4, sig: "456"},
    ],
    envelopeSigs: [
      {address: "0x02", keyId: 0, sig: "123"},
      {address: "0x02", keyId: 1, sig: "333"},
    ],
  })
})

test("Voucher sent to Current User Pre-Authz includes other authorizer addresses", async () => {
  const mockResolve = jest.fn().mockImplementation(async acct => [
    {
      ...acct,
      addr: "0x01",
      keyId: 1,
      sequenceNum: 123,
      signingFunction: () => ({signature: "123"}),
      role: {proposer: true, payer: true, authorizer: true},
    },
  ])
  const currentUser = account => ({
    ...account,
    tempId: "CURRENT_USER",
    resolve: mockResolve,
  })
  const customAuthz = async acct => ({
    ...acct,
    addr: "0x02",
    keyId: 2,
    sequenceNum: 234,
    signingFunction: () => ({signature: "234"}),
  })

  const ix = await resolve(
    await build([
      transaction``,
      limit(156),
      proposer(currentUser),
      authorizations([customAuthz, currentUser]),
      payer(currentUser),
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
    payer: "0x01",
    authorizers: ["0x02", "0x01"],
    payloadSigs: [{address: "0x02", keyId: 2, sig: "234"}],
    envelopeSigs: [{address: "0x01", keyId: 1, sig: "123"}],
  })

  expect(mockResolve).toHaveBeenCalledTimes(1)
  // Verify pre-signable contains custom authz in the authorizers list
  expect(mockResolve.mock.calls[0][1].voucher.authorizers).toEqual([
    "0x02",
    null,
  ])
})
