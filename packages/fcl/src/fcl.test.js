// mock send function so getChainId does not hit the chain at startup
config.put("sdk.transport", async ix => ix)

import {serialize} from "./serialize"
import {
  resolve,
  build,
  transaction,
  limit,
  proposer,
  authorizations,
  payer,
  ref,
  createSignableVoucher,
  config,
} from "@onflow/sdk"
import {VERSION} from "@onflow/sdk/src/VERSION"

test("fcl.VERSION needs to match version in package.json", () => {
  expect(VERSION).toBe("TESTVERSION")
})

test("serialize returns voucher", async () => {
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
      payer(authz),
      ref("123"),
    ]),
    {
      skipExec: true,
    }
  )

  const voucher = createSignableVoucher(ix)

  const serializedVoucher = await serialize(
    [
      transaction``,
      limit(156),
      proposer(authz),
      authorizations([authz]),
      payer(authz),
      ref("123"),
    ],
    {resolve, skipExec: true}
  )

  expect(JSON.parse(serializedVoucher)).toEqual(voucher)
})
