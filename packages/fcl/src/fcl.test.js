import * as fcl from "./fcl"
import fs from "fs"
import path from "path"
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
} from "@onflow/sdk"

test("fcl.VERSION needs to match version in package.json", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8")
  )
  expect(pkg.version).toBe(fcl.VERSION)
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
