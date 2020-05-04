import assert from "assert"
import {build, resolve, transaction, limit, proposer} from "./sdk"

describe("build", () => {
  it("returns the correct limit when building a transaction", async () => {
    const one = await resolve(await build([
      transaction``,
      limit(156)
    ]))

    const two = await resolve(await build([
      limit(156),
      transaction``
    ]))

    assert.equal(one.message.computeLimit, 156)
    assert.equal(two.message.computeLimit, 156)
    assert.deepEqual(one.message.limit, two.message.limit)
  })

  it("returns the correct proposer when building a transaction with a known proposer", async () => {
    const ix = await resolve(await build([
      transaction``,
      proposer("01", 1, 123)
    ]))

    const txProposer = ix.accounts[ix.proposer]

    console.log('ix.accounts', ix.accounts)
    console.log('ix', ix)

    assert.deepEqual(txProposer.addr, "01")
    assert.deepEqual(txProposer.keyId, 1)
    assert.deepEqual(txProposer.sequenceNum, 123)
  })
})
