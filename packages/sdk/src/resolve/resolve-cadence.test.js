import {interaction, pipe, put, makeScript} from "../interaction/interaction.js"
import {resolveCadence} from "./resolve-cadence.js"
import {overload} from "../test-utils/overload"
import {run} from "../test-utils/run"
import {script} from "../sdk"

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

test("cadence address overloading", async () => {
  const ADDRESS = "0x1234567890123456"
  await overload(
    {
      "0xProfile": ADDRESS,
      // "debug.resolvedCadence": true,
    },
    async () => {
      var ix = await run([
        script`
          import Profile from 0xProfile
        `,
      ])
      expect(ix.message.cadence.trim()).toBe(`import Profile from ${ADDRESS}`)
    }
  )
})
