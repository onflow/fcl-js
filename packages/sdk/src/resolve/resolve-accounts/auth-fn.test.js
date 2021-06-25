import {overload} from "../../test-utils/overload"
import {run} from "../../test-utils/run"
import {
  authzFn,
  authzResolve,
  authzResolveMany,
} from "../../test-utils/authz-fn"
import {mockSend} from "../../test-utils/mock-send"
import {config, transaction, proposer, authorizations, payer} from "../../sdk"

const idof = acct => `${acct.addr}-${acct.keyId}`

// Signatories
const S1 = {addr: "0x1111222233334444", keyId: 1}
const S1b = {...S1, keyId: 2}
const S1c = {...S1, keyId: 3}

const S2 = {addr: "0x4444333322221111", keyId: 1}
const S2b = {...S2, keyId: 2}

const S3 = {addr: "0x9999999999999999", keyId: 1}
const S3b = {...S3, keyId: 2}

test("single account/key pair for all three signatory roles", async () => {
  await overload(
    {
      "sdk.send": mockSend(),
    },
    async () => {
      var ix = await run([
        transaction`CODE`,
        proposer(authzFn(S1)),
        authorizations([authzFn(S1)]),
        payer(authzFn(S1)),
      ])

      // Single Signatory
      expect(Object.keys(ix.accounts).length).toBe(1)
      expect(ix.accounts[idof(S1)]).toBeDefined()

      expect(ix.proposer).toBe(idof(S1))
      expect(ix.payer).toBe(idof(S1))
      expect(ix.authorizations).toEqual([idof(S1)])
    }
  )
})

test("single account/key pair for all three signatory roles but an additional authorizer", async () => {
  await overload(
    {
      "sdk.send": mockSend(),
    },
    async () => {
      var ix = await run([
        transaction`CODE`,
        proposer(authzFn(S1)),
        authorizations([authzFn(S1), authzFn(S2)]),
        payer(authzFn(S1)),
      ])

      // Two Signatories
      expect(Object.keys(ix.accounts).length).toBe(2)
      expect(ix.accounts[idof(S1)]).toBeDefined()
      expect(ix.accounts[idof(S2)]).toBeDefined()

      expect(ix.proposer).toBe(idof(S1))
      expect(ix.payer).toBe(idof(S1))
      expect(ix.authorizations).toEqual([idof(S1), idof(S2)])
    }
  )
})

test("All three signatories are different accounts", async () => {
  await overload(
    {
      "sdk.send": mockSend(),
    },
    async () => {
      var ix = await run([
        transaction`CODE`,
        proposer(authzFn(S1)),
        authorizations([authzFn(S2)]),
        payer(authzFn(S3)),
      ])

      // Three Signatories
      expect(Object.keys(ix.accounts).length).toBe(3)
      expect(ix.accounts[idof(S1)]).toBeDefined()
      expect(ix.accounts[idof(S2)]).toBeDefined()
      expect(ix.accounts[idof(S3)]).toBeDefined()

      expect(ix.proposer).toBe(idof(S1))
      expect(ix.authorizations).toEqual([idof(S2)])
      expect(ix.payer).toBe(idof(S3))
    }
  )
})

test("Single Resolved Authz FN", async () => {
  await overload(
    {
      "sdk.send": mockSend(),
    },
    async () => {
      var ix = await run([
        transaction`CODE`,
        proposer(authzResolve(S1)),
        authorizations([authzResolve(S1)]),
        payer(authzResolve(S1)),
      ])

      // Single Signatory
      expect(Object.keys(ix.accounts).length).toBe(1)
      expect(ix.accounts[idof(S1)]).toBeDefined()
      expect(ix.authorizations.length).toBe(1)

      expect(ix.proposer).toBe(idof(S1))
      expect(ix.payer).toBe(idof(S1))
      expect(ix.authorizations).toEqual([idof(S1)])
    }
  )
})

test("The PreAuthz Usecase same signatories", async () => {
  await overload(
    {
      "sdk.send": mockSend(),
      // "debug.resolveAccounts": true,
    },
    async () => {
      const authz = authzResolveMany({
        tempId: "CURRENT_USER",
        proposer: S1,
        authorizations: [S1],
        payer: S1,
      })

      var ix = await run([
        transaction`CODE`,
        proposer(authz),
        authorizations([authz]),
        payer(authz),
      ])

      // Single Signatoru
      expect(Object.keys(ix.accounts).length).toBe(1)
      expect(ix.accounts[idof(S1)]).toBeDefined()

      expect(ix.proposer).toBe(idof(S1))
      expect(ix.payer).toBe(idof(S1))

      expect(ix.authorizations.length).toBe(1)
      expect(ix.authorizations).toEqual([idof(S1)])
    }
  )
})

test("The PreAuthz Usecase - mixed signatories", async () => {
  await overload(
    {
      "sdk.send": mockSend(),
      // "debug.resolvedAccounts": true,
      // "debug.resolveAccounts": true,
      // "debug.resolve": true,
    },
    async () => {
      const authz = authzResolveMany({
        tempId: "CURRENT_USER",
        proposer: S1,
        authorizations: [S1, S1b, S1c],
        payer: S2,
      })

      var ix = await run([
        transaction`CODE`,
        proposer(authz),
        authorizations([authz]),
        payer(authz),
      ])

      // Two Signatories
      expect(Object.keys(ix.accounts).length).toBe(4)
      expect(ix.accounts[idof(S1)]).toBeDefined()
      expect(ix.accounts[idof(S1b)]).toBeDefined()
      expect(ix.accounts[idof(S1c)]).toBeDefined()
      expect(ix.accounts[idof(S2)]).toBeDefined()

      expect(ix.proposer).toBe(idof(S1))
      expect(ix.payer).toBe(idof(S2))

      expect(ix.authorizations.length).toBe(3)
      expect(ix.authorizations).toEqual([idof(S1), idof(S1b), idof(S1c)])
    }
  )
})
