/**
 * @jest-environment node
 */
import * as fcl from "../fcl"
import {ec as EC} from "elliptic"
import {SHA3} from "sha3"

const ec = new EC("p256")

// aaa = Mainnet account (from accounts/flow.json)
const MAINNET_ACCOUNT = {
  address: "b3244809ffc1f3e9",
  privateKey:
    "2b8e9f3cd2e93e8e93ce4705e7f4bada9b4aab064b6c87839aa6d1dc6d8729a8",
  keyId: 0,
}

// fooo = Testnet account (from accounts/flow.json)
const TESTNET_ACCOUNT = {
  address: "0855b236d47fdf31",
  privateKey:
    "f8a85de7947793f4f12a1374086a07aadfba4538da49f8544080de7a7fceb844",
  keyId: 0,
}

const EMPTY_TRANSACTION = `
  transaction {
    prepare(acct: &Account) {}
    execute {}
  }
`

function signWithKey(privateKey: string, message: string): string {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sha3Hash = new SHA3(256)
  sha3Hash.update(Buffer.from(message, "hex"))
  const digest = sha3Hash.digest()
  const sig = key.sign(digest)
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

function createAuthz(account: {
  address: string
  privateKey: string
  keyId: number
}) {
  return (acct: any) => ({
    ...acct,
    addr: account.address,
    keyId: account.keyId,
    signingFunction: async (signable: any) => ({
      addr: account.address,
      keyId: account.keyId,
      signature: signWithKey(account.privateKey, signable.message),
    }),
  })
}

describe("REST Testnet", () => {
  beforeAll(() => {
    fcl.config()
      .put("accessNode.api", "https://rest-testnet.onflow.org")
      .put("flow.network", "testnet")
  })

  test(
    "mutate empty transaction and onceSealed",
    async () => {
      const authz = createAuthz(TESTNET_ACCOUNT)
      const txId = await fcl.mutate({
        cadence: EMPTY_TRANSACTION,
        authz,
        limit: 100,
      })

      expect(txId).toBeDefined()
      expect(typeof txId).toBe("string")

      console.log(`[testnet/onceSealed] txId: ${txId}`)

      try {
        const sealed = await fcl.tx(txId).onceSealed()
        console.log(`[testnet/onceSealed] sealed status: ${sealed.status}`)
        expect(sealed.status).toBeGreaterThanOrEqual(4)
      } catch (e: any) {
        console.log(`[testnet/onceSealed] sealed with TransactionError: ${e.message}`)
        expect(e.constructor.name).toBe("TransactionError")
      }
    },
    120_000
  )

  test(
    "mutate empty transaction and subscribe",
    async () => {
      const authz = createAuthz(TESTNET_ACCOUNT)
      const txId = await fcl.mutate({
        cadence: EMPTY_TRANSACTION,
        authz,
        limit: 100,
      })

      console.log(`[testnet/subscribe] txId: ${txId}`)

      const statuses: number[] = []
      await new Promise<void>((resolve, reject) => {
        const unsub = fcl.tx(txId).subscribe(
          (status) => {
            console.log(`[testnet/subscribe] status: ${status.status} statusCode: ${status.statusCode} errorMessage: ${status.errorMessage || "(none)"}`)
            statuses.push(status.status)
            if (status.status >= 4) {
              unsub()
              resolve()
            }
          },
          (err) => {
            unsub()
            reject(err)
          }
        )
      })

      console.log(`[testnet/subscribe] received ${statuses.length} status updates: [${statuses.join(", ")}]`)
      expect(statuses.length).toBeGreaterThan(0)
      expect(statuses[statuses.length - 1]).toBeGreaterThanOrEqual(4)
    },
    120_000
  )
})

describe("REST Mainnet", () => {
  beforeAll(() => {
    fcl.config()
      .put("accessNode.api", "https://rest-mainnet.onflow.org")
      .put("flow.network", "mainnet")
  })

  test(
    "mutate empty transaction and onceSealed",
    async () => {
      const authz = createAuthz(MAINNET_ACCOUNT)
      const txId = await fcl.mutate({
        cadence: EMPTY_TRANSACTION,
        authz,
        limit: 100,
      })

      expect(txId).toBeDefined()
      expect(typeof txId).toBe("string")

      console.log(`[mainnet/onceSealed] txId: ${txId}`)

      try {
        const sealed = await fcl.tx(txId).onceSealed()
        console.log(`[mainnet/onceSealed] sealed status: ${sealed.status}`)
        expect(sealed.status).toBeGreaterThanOrEqual(4)
      } catch (e: any) {
        console.log(`[mainnet/onceSealed] sealed with TransactionError: ${e.message}`)
        expect(e.constructor.name).toBe("TransactionError")
      }
    },
    120_000
  )

  test(
    "mutate empty transaction and subscribe",
    async () => {
      const authz = createAuthz(MAINNET_ACCOUNT)
      const txId = await fcl.mutate({
        cadence: EMPTY_TRANSACTION,
        authz,
        limit: 100,
      })

      console.log(`[mainnet/subscribe] txId: ${txId}`)

      const statuses: number[] = []
      await new Promise<void>((resolve, reject) => {
        const unsub = fcl.tx(txId).subscribe(
          (status) => {
            console.log(`[mainnet/subscribe] status: ${status.status} statusCode: ${status.statusCode} errorMessage: ${status.errorMessage || "(none)"}`)
            statuses.push(status.status)
            if (status.status >= 4) {
              unsub()
              resolve()
            }
          },
          (err) => {
            unsub()
            reject(err)
          }
        )
      })

      console.log(`[mainnet/subscribe] received ${statuses.length} status updates: [${statuses.join(", ")}]`)
      expect(statuses.length).toBeGreaterThan(0)
      expect(statuses[statuses.length - 1]).toBeGreaterThanOrEqual(4)
    },
    120_000
  )
})
