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

test("config", async () => {
  const $ = fcl.config()
  expect(await $.get("accessNode.api")).toBe("http://localhost:8080")
})

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
    keyId: 1,
    sequenceNum: 123,
  }

  const serializedVoucher = JSON.stringify(
    {
      cadence: "",
      refBlock: "123",
      computeLimit: 156,
      arguments: [],
      proposalKey: {
        address: "0x01",
        keyId: 1,
        sequenceNum: 123,
      },
      payer: "0x01",
      authorizers: ["0x01"],
      payloadSigs: [
        {
          address: "0x01",
          keyId: 1,
          sig: "123",
        },
        {
          address: "0x01",
          keyId: 1,
          sig: "123",
        },
      ],
    },
    null,
    2
  )

  const serializedIx = await serialize(
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

  expect(serializedIx).toEqual(serializedVoucher)
})
