import {interaction, pipe, put, makeScript} from "../interaction/interaction.js"
import {resolveCadence} from "./resolve-cadence.js"
import {config} from "@onflow/config"

const idle = () => new Promise(resolve => setTimeout(resolve), 0)

describe("resolveCadence", () => {
  describe("0xHelloWorld-style account identifier syntax", () => {
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

    test("replaces all addresses from config", async () => {
      const CADENCE = async function () {
        return `
        import MyContract from 0xMY_CONTRACT_ADDRESS
  
        pub fun main(): Address {
          return 0xMY_CONTRACT_ADDRESS
        }
      `
      }

      const RESULT = async function () {
        return `
        import MyContract from 0x123abc
  
        pub fun main(): Address {
          return 0x123abc
        }
      `
      }

      await config.put("0xMY_CONTRACT_ADDRESS", "0x123abc")

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        resolveCadence,
      ])(interaction())

      expect(ix.message.cadence).toEqual(await RESULT())
    })

    test("similar config names do not replace each other", async () => {
      const CADENCE = async function () {
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

      const RESULT = async function () {
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

      config.put("0xFoo", "0x123").put("0xFooBar", "0x456")

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        resolveCadence,
      ])(interaction())

      expect(ix.message.cadence).toEqual(await RESULT())
    })
  })

  describe("new Identifier syntax", () => {
    test("single import statement", async () => {
      const CADENCE = `import "Foo"

pub fun main(): Address {
  return "Foo"
}`

      const expected = `import Foo from 0x1

pub fun main(): Address {
  return "Foo"
}`

      await config().put("system.contracts.Foo", "0x1")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        resolveCadence,
      ])(interaction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("multiple import statements with only one defined", async () => {
      const CADENCE = `import "Foo"
import "Bar"

pub fun main(): Address {
  return "Foo"
}`

      const expected = `import Foo from 0x1
import "Bar"

pub fun main(): Address {
  return "Foo"
}`

      await config().put("system.contracts.Foo", "0x1")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        resolveCadence,
      ])(interaction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("multiple import statements", async () => {
      const CADENCE = `import "Foo"
import "Bar"

pub fun main(): Address {
  return "Foo"
}`

      const expected = `import Foo from 0x1
import Bar from 0x2

pub fun main(): Address {
  return "Foo"
}`

      await config().put("system.contracts.Foo", "0x1")
      await config().put("system.contracts.Bar", "0x2")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        resolveCadence,
      ])(interaction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("should prefix addresses with `0x` if not already present", async () => {
      const CADENCE = `import "Foo"

pub fun main(): Address {
  return "Foo"
}`

      const expected = `import Foo from 0x1

pub fun main(): Address {
  return "Foo"
}`

      await config().put("system.contracts.Foo", "1")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        resolveCadence,
      ])(interaction())

      expect(ix.message.cadence).toEqual(expected)
    })
  })
})
