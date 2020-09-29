import {interaction, pipe, put, makeScript} from "@onflow/interaction"
import {makeParam} from "@onflow/interaction"
import {resolveCadence} from "./index.js"

const log = msg => ix => (console.log(msg, ix), ix)

test("cadence is a string", async () => {
  const CADENCE = "CADENCE_STRING"

  const ix = await pipe([
    makeScript,
    put("ix.cadence", CADENCE),
    resolveCadence,
  ])(interaction())

  expect(ix.message.cadence).toBe(CADENCE)
})

test("cadence is a function", async () => {
  const CADENCE = async function () {
    return "CADENCE_ASYNC_FUNCTION"
  }

  const ix = await pipe([
    makeScript,
    put("ix.cadence", CADENCE),
    resolveCadence,
  ])(interaction())

  expect(ix.message.cadence).toBe(await CADENCE())
})

test("[DEPRECATED] cadence with params", async () => {
  const CADENCE = async function (params = {}) {
    console.log("PARAMS", params)
    return `CADENCE WITH PARAMS: foo:${params.foo}, bar:${params.bar}`
  }

  const ix = await pipe([
    makeScript,
    put("ix.cadence", CADENCE),
    params([
      param("FOO", null, "foo"),
      param("BAR", null, "bar"),
    ]),
    resolveCadence,
  ])(interaction())

  expect(ix.message.cadence).toBe(await CADENCE({ foo:"FOO", bar:"BAR" }))
})

function params(px = []) {
  return pipe(px.map(param => makeParam(typeof param === "function" ? { resolve: param } : param )))
}

function param(value, xform, key = null) {
  return {key, value, xform}
}
