import assert from "assert"
import {get} from "@onflow/interaction"
import {build, resolve, transaction, limit, proposer, proposalKey} from "./sdk"

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

    assert.equal(one.payload.limit, 156)
    assert.equal(two.payload.limit, 156)
    assert.deepEqual(one.payload.limit, two.payload.limit)
  })

  it("returns the correct proposer when building a transaction with a known proposer", async () => {
    const ix = await resolve(await build([
      transaction``,
      proposer("01", 1, 123)
    ]))

    const txProposer = get(ix, "tx.proposer")

    assert.deepEqual(txProposer, {addr: "01", proposalKeyIndex: 1, sequenceNumber: 123 })
  })

  it("returns the correct proposer when building a transaction with a fetched proposer", async () => {
    const asyncProposer = async () => {
      return proposalKey("01", 1, 123)
    }
    
    const ix = await resolve(await build([
      transaction``,
      proposer(asyncProposer)
    ]))

    const txProposer = get(ix, "tx.proposer")

    assert.deepEqual(txProposer, {addr: "01", proposalKeyIndex: 1, sequenceNumber: 123 })
  })

  it("returns the correct proposer when building a transaction with a given proposalKey", async () => {
    const ix = await resolve(await build([
      transaction``,
      proposer(proposalKey("01", 1, 123))
    ]))

    const txProposer = get(ix, "tx.proposer")

    assert.deepEqual(txProposer, {addr: "01", proposalKeyIndex: 1, sequenceNumber: 123 })
  })
})
