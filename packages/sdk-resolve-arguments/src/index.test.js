import * as t from "@onflow/types"
import {interaction, pipe, makeScript} from "@onflow/interaction"
import {makeArgument} from "@onflow/interaction"
import {resolveArguments} from "./index.js"

test("sanity check noop", async () => {
  
  const sansArgs = await pipe([
    makeScript,
  ])(interaction())

  const withArgs = await pipe([
    makeScript,
    resolveArguments,
  ])(interaction())

  expect(sansArgs).toEqual(withArgs)
})

test("with args", async () => {
  const ix = await pipe([
    makeScript,
    args([
      arg(1, t.Int),
      arg("rawr", t.String),
    ]),
    resolveArguments,
  ])(interaction())

  expect(Object.keys(ix.arguments).length).toBe(2)
})


function args(ax = []) {
  return pipe(ax.map(makeArgument))
}

function arg(value, xform = identity) {
  return {value, xform}
}
