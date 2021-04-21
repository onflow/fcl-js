import {interaction, pipe, put, makeScript} from "../interaction/interaction.js"
import {resolveCadence} from "./resolve-cadence.js"

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
