import {interaction, pipe, put, makeScript} from "../interaction/interaction.js"
import {resolveCadence} from "./resolve-cadence.js"
import {config} from "../sdk.js"

const log = msg => ix => (console.log(msg, ix), ix)

describe('resolveCadence', () => {
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
    const CADENCE = async function() {
      return "CADENCE_ASYNC_FUNCTION"
    }
  
    const ix = await pipe([
      makeScript,
      put("ix.cadence", CADENCE),
      resolveCadence,
    ])(interaction())
  
    expect(ix.message.cadence).toBe(await CADENCE())
  })
  
  test("cadence replaces all addresses in config", async () => {
    const CADENCE = async function() {
      return `
        import MyContract from '0xMY_CONTRACT_ADDRESS'
  
        pub fun main(): Address {
          return 0xMY_CONTRACT_ADDRESS
        }
      `
    }
  
    const RESULT = async function() {
      return `
        import MyContract from '0x123abc'
  
        pub fun main(): Address {
          return 0x123abc
        }
      `
    }
  
    config.put("0xMY_CONTRACT_ADDRESS", "0x123abc")
  
    const ix = await pipe([
      makeScript,
      put("ix.cadence", CADENCE),
      resolveCadence,
    ])(interaction())
  
    expect(ix.message.cadence).toEqual(await RESULT())
  })
})
