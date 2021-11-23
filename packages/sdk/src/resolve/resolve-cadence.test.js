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
  
  test("replaces all addresses from config", async () => {
    const CADENCE = async function() {
      return `
        import MyContract from 0xMY_CONTRACT_ADDRESS
  
        pub fun main(): Address {
          return 0xMY_CONTRACT_ADDRESS
        }
      `
    }
  
    const RESULT = async function() {
      return `
        import MyContract from 0x123abc
  
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

  test("similar config names do not replace each other", async () => {
    const CADENCE = async function() {
      return `
        import FooBar from 0xFoo
        import FooBar from 0xFooBar

        pub fun main(): Address {
          log(0xFoo)
          return 0xFoo
        }

        pub fun other(): Address {
          log(0xFooBar)
          return 0xFooBar
        }

        pub fun otherTwo(): Address {return 0xFoo}
        pub fun otherThree(): Address {return 0xFooBar}
      `
    }
  
    const RESULT = async function() {
      return `
        import FooBar from 0x123
        import FooBar from 0x456

        pub fun main(): Address {
          log(0x123)
          return 0x123
        }

        pub fun other(): Address {
          log(0x456)
          return 0x456
        }

        pub fun otherTwo(): Address {return 0x123}
        pub fun otherThree(): Address {return 0x456}
      `
    }
  
    config
      .put('0xFoo', '0x123')
      .put('0xFooBar', '0x456')
  
    const ix = await pipe([
      makeScript,
      put("ix.cadence", CADENCE),
      resolveCadence,
    ])(interaction())
  
    expect(ix.message.cadence).toEqual(await RESULT())
  })
})
