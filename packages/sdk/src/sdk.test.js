import assert from "assert"
import {build, resolve, transaction, limit} from "./sdk"

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
})
