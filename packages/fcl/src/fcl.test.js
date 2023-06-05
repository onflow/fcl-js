import {serialize} from "./serialize"
import {
  authorizations,
  build,
  createSignableVoucher,
  limit,
  payer,
  proposer,
  ref,
  resolve,
  transaction,
} from "@onflow/sdk"

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
    ])
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
    {resolve}
  )

  expect(JSON.parse(serializedVoucher)).toEqual(voucher)
})
