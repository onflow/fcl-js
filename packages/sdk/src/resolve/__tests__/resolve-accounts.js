import {config, TestUtils} from "../../sdk"
import * as sdk from "../../sdk"

// SIGNATORIES

const S1a = {addr: "0x1111111111111111", keyId: 1}
const S1b = {...S1a, keyId: 2}
const S1c = {...S1a, keyId: 3}

const S2a = {addr: "0x2222222222222222", keyId: 1}
const S2b = {...S2a, keyId: 2}
const S2c = {...S2a, keyId: 3}

const S3a = {addr: "0x3333333333333333", keyId: 1}
const S3b = {...S3a, keyId: 2}
const S3c = {...S3a, keyId: 3}

test("single account/key pair for all three signatory roles", async () => {
  await config.overload(
    {
      "sdk.transport": TestUtils.mockSend(),
      "debug.accounts": false,
    },
    async () => {
      var ix = await TestUtils.run([
        sdk.transaction`CODE`,
        sdk.proposer(TestUtils.authzFn(S1a)),
        sdk.authorizations([TestUtils.authzFn(S1a)]),
        sdk.payer(TestUtils.authzFn(S1a)),
      ])

      // Single Signatory
      expect(Object.keys(ix.accounts).length).toBe(1)
      expect(ix.accounts[TestUtils.idof(S1a)]).toBeDefined()

      expect(ix.proposer).toBe(TestUtils.idof(S1a))
      expect(ix.payer).toBe(TestUtils.idof(S1a))
      expect(ix.authorizations).toEqual([TestUtils.idof(S1a)])
    }
  )
})

test("single account/key pair for all three signatory roles but an additinal authorizer", async () => {
  await config.overload(
    {
      "sdk.transport": TestUtils.mockSend(),
      "debug.accounts": false,
    },
    async () => {
      var ix = await TestUtils.run([
        sdk.transaction`CODE`,
        sdk.proposer(TestUtils.authzFn(S1a)),
        sdk.authorizations([TestUtils.authzFn(S1a), TestUtils.authzFn(S1b)]),
        sdk.payer(TestUtils.authzFn(S1a)),
      ])

      // TWo Signatories
      expect(Object.keys(ix.accounts).length).toBe(2)
      expect(ix.accounts[TestUtils.idof(S1a)]).toBeDefined()
      expect(ix.accounts[TestUtils.idof(S1b)]).toBeDefined()

      expect(ix.proposer).toBe(TestUtils.idof(S1a))
      expect(ix.payer).toBe(TestUtils.idof(S1a))
      expect(ix.authorizations).toEqual([
        TestUtils.idof(S1a),
        TestUtils.idof(S1b),
      ])
    }
  )
})

test("All three signatories are different accounts", async () => {
  await config.overload(
    {
      "sdk.transport": TestUtils.mockSend(),
      "debug.accounts": false,
    },
    async () => {
      var ix = await TestUtils.run([
        sdk.transaction`CODE`,
        sdk.proposer(TestUtils.authzFn(S1a)),
        sdk.authorizations([TestUtils.authzFn(S2a)]),
        sdk.payer(TestUtils.authzFn(S3a)),
      ])

      // Three signatories
      expect(Object.keys(ix.accounts).length).toBe(3)
      expect(ix.accounts[TestUtils.idof(S1a)]).toBeDefined()
      expect(ix.accounts[TestUtils.idof(S2a)]).toBeDefined()
      expect(ix.accounts[TestUtils.idof(S3a)]).toBeDefined()

      expect(ix.proposer).toBe(TestUtils.idof(S1a))
      expect(ix.authorizations).toEqual([TestUtils.idof(S2a)])
      expect(ix.payer).toBe(TestUtils.idof(S3a))
    }
  )
})

test("The PreAuthz Usecase same signatories", async () => {
  await config.overload(
    {
      "sdk.transport": TestUtils.mockSend(),
      "debug.accounts": false,
    },
    async () => {
      const authz = TestUtils.authzResolveMany({
        tempId: "CURRENT_USER",
        proposer: S1a,
        authorizations: [S1a],
        payer: S1a,
      })

      var ix = await TestUtils.run([
        sdk.transaction`CODE`,
        sdk.proposer(authz),
        sdk.payer(authz),
        sdk.authorizations([authz]),
      ])

      // Single Signatory
      expect(Object.keys(ix.accounts).length).toBe(1)
      expect(ix.accounts[TestUtils.idof(S1a)]).toBeDefined()

      expect(ix.proposer).toBe(TestUtils.idof(S1a))
      expect(ix.payer).toBe(TestUtils.idof(S1a))

      expect(ix.authorizations.length).toBe(1)
      expect(ix.authorizations).toEqual([TestUtils.idof(S1a)])
    }
  )
})

test("The PreAuthz Usecase - mixed signatories (wallet covers transaction fees)", async () => {
  await config.overload(
    {
      "sdk.transport": TestUtils.mockSend(),
      "debug.accounts": false,
    },
    async c => {
      const authz = TestUtils.authzResolveMany({
        tempId: "CURRENT_USER",
        proposer: S1a,
        authorizations: [S1a, S1b, S1c],
        payer: S2a, // wallet covers transaction
      })

      var ix = await TestUtils.run([
        sdk.transaction`CODE`,
        sdk.proposer(authz),
        sdk.payer(authz),
        sdk.authorizations([authz]),
      ])

      // Four Signatories
      expect(Object.keys(ix.accounts).length).toBe(4)
      expect(ix.accounts[TestUtils.idof(S1a)]).toBeDefined()
      expect(ix.accounts[TestUtils.idof(S1b)]).toBeDefined()
      expect(ix.accounts[TestUtils.idof(S1c)]).toBeDefined()
      expect(ix.accounts[TestUtils.idof(S2a)]).toBeDefined()

      expect(ix.proposer).toBe(TestUtils.idof(S1a))
      expect(ix.payer).toBe(TestUtils.idof(S2a))

      expect(ix.authorizations.length).toBe(3)
      expect(ix.authorizations).toEqual([
        TestUtils.idof(S1a),
        TestUtils.idof(S1b),
        TestUtils.idof(S1c),
      ])
    }
  )
})
