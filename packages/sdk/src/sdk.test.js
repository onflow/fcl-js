import assert from "assert"
import {build, resolve, transaction, limit, proposer, authorization, params, param, resolveParams} from "./sdk"

describe("build", () => {
  it("returns the correct limit when building a transaction", async () => {
    const one = await resolve(await build([transaction``, limit(156)]))

    const two = await resolve(await build([limit(156), transaction``]))

    assert.equal(one.message.computeLimit, 156)
    assert.equal(two.message.computeLimit, 156)
    assert.deepEqual(one.message.limit, two.message.limit)
  })

  it("returns the correct proposer when building a transaction with a known proposer", async () => {
    const ix = await resolve(
      await build([transaction``, proposer(authorization("01", () => {}, 1, 123))])
    )

    const txProposer = ix.accounts[ix.proposer]

    assert.deepEqual(txProposer.addr, "01")
    assert.deepEqual(txProposer.keyId, 1)
    assert.deepEqual(txProposer.sequenceNum, 123)
  })

  // TODO: Uncomment once interaction params have resolve field 

  // it("accepts an async function as a param", async () => {
  //   const identity = {
  //     asParam: v => v,
  //     asInjection: v => v,
  //   }

  //   const ix = await resolve(await build([
  //     transaction``,
  //     params([ async () => {
  //       return {
  //         key: "my_param", value: 1, xform: identity
  //       }
  //     } ])
  //   ]), [ resolveParams ])

  //   const ixParams = Object.values(ix.params)
  //   const p = ixParams.find(p => p.key === "my_param")

  //   assert.deepEqual(p.key, "my_param")
  //   assert.deepEqual(p.value, 1)
  // })
})
