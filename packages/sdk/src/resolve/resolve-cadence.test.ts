import {
  initInteraction,
  pipe,
  put,
  makeScript,
} from "../interaction/interaction"
import {resolveCadence} from "./resolve-cadence"
import {config} from "@onflow/config"
import {getGlobalContext} from "../context/global"

const idle = () => new Promise(resolve => setTimeout(resolve, 0))

describe("resolveCadence", () => {
  describe("0xHelloWorld-style account identifier syntax", () => {
    test("cadence is a string", async () => {
      const CADENCE = "CADENCE_STRING"

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toBe(CADENCE)
    })

    test("cadence is a function", async () => {
      const CADENCE = async function () {
        return "CADENCE_ASYNC_FUNCTION"
      }

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toBe(await CADENCE())
    })

    test("replaces all addresses from config", async () => {
      const CADENCE = async function () {
        return `
        import MyContract from 0xMY_CONTRACT_ADDRESS
  
        access(all) fun main(): Address {
          return 0xMY_CONTRACT_ADDRESS
        }
      `
      }

      const RESULT = async function () {
        return `
        import MyContract from 0x123abc
  
        access(all) fun main(): Address {
          return 0x123abc
        }
      `
      }

      await config.put("0xMY_CONTRACT_ADDRESS", "0x123abc")

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(await RESULT())
    })

    test("similar config names do not replace each other", async () => {
      const CADENCE = async function () {
        return `
        import FooBar from 0xFoo
        import FooBar from 0xFooBar

        access(all) fun main(): Address {
          log(0xFoo)
          return 0xFoo
        }

        access(all) fun other(): Address {
          log(0xFooBar)
          return 0xFooBar
        }

        access(all) fun otherTwo(): Address {return 0xFoo}
        access(all) fun otherThree(): Address {return 0xFooBar}
      `
      }

      const RESULT = async function () {
        return `
        import FooBar from 0x123
        import FooBar from 0x456

        access(all) fun main(): Address {
          log(0x123)
          return 0x123
        }

        access(all) fun other(): Address {
          log(0x456)
          return 0x456
        }

        access(all) fun otherTwo(): Address {return 0x123}
        access(all) fun otherThree(): Address {return 0x456}
      `
      }

      config.put("0xFoo", "0x123").put("0xFooBar", "0x456")

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(await RESULT())
    })
  })

  describe("new Identifier syntax", () => {
    test("single import statement", async () => {
      const CADENCE = `import "Foo"

access(all) fun main(): Address {
  return "Foo"
}`

      const expected = `import Foo from 0x1

access(all) fun main(): Address {
  return "Foo"
}`

      await config().put("system.contracts.Foo", "0x1")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("multiple import statements with only one defined", async () => {
      const CADENCE = `import "Foo"
import "Bar"

access(all) fun main(): Address {
  return "Foo"
}`

      const expected = `import Foo from 0x1
import "Bar"

access(all) fun main(): Address {
  return "Foo"
}`

      await config().put("system.contracts.Foo", "0x1")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("multiple import statements", async () => {
      const CADENCE = `import "Foo"
import "Bar"

access(all) fun main(): Address {
  return "Foo"
}`

      const expected = `import Foo from 0x1
import Bar from 0x2

access(all) fun main(): Address {
  return "Foo"
}`

      await config().put("system.contracts.Foo", "0x1")
      await config().put("system.contracts.Bar", "0x2")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("should prefix addresses with `0x` if not already present", async () => {
      const CADENCE = `import "Foo"

access(all) fun main(): Address {
  return "Foo"
}`

      const expected = `import Foo from 0x1

access(all) fun main(): Address {
  return "Foo"
}`

      await config().put("system.contracts.Foo", "1")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })
  })

  describe("mixed import syntax", () => {
    test("supports both string imports and traditional imports", async () => {
      const CADENCE = `import "FungibleToken"
import MyContract from 0x12345678

access(all) fun main(): Address {
  return 0x12345678
}`

      const expected = `import FungibleToken from 0xf233dcee88fe0abe
import MyContract from 0x12345678

access(all) fun main(): Address {
  return 0x12345678
}`

      await config().put("system.contracts.FungibleToken", "0xf233dcee88fe0abe")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("supports multiple string imports with traditional imports", async () => {
      const CADENCE = `import "FungibleToken"
import "NonFungibleToken"
import MyContract from 0xABCDEF
import FlowToken from 0x0ae53cb6e3f42a79

access(all) fun main(): String {
  return "mixed imports work"
}`

      const expected = `import FungibleToken from 0xf233dcee88fe0abe
import NonFungibleToken from 0x1d7e57aa55817448
import MyContract from 0xABCDEF
import FlowToken from 0x0ae53cb6e3f42a79

access(all) fun main(): String {
  return "mixed imports work"
}`

      await config().put("system.contracts.FungibleToken", "0xf233dcee88fe0abe")
      await config().put(
        "system.contracts.NonFungibleToken",
        "0x1d7e57aa55817448"
      )
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("traditional imports with explicit addresses should not be modified", async () => {
      const CADENCE = `import FlowToken from 0x7e60df042a9c0868
import MyContract from 0x1234567890abcdef

access(all) fun main(): UFix64 {
  return 42.0
}`

      const expected = `import FlowToken from 0x7e60df042a9c0868
import MyContract from 0x1234567890abcdef

access(all) fun main(): UFix64 {
  return 42.0
}`

      // No config needed - explicit addresses should work as-is
      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("string import without config should log warning and leave import unchanged", async () => {
      const CADENCE = `import "UnconfiguredContract"
import FlowToken from 0x7e60df042a9c0868

access(all) fun main(): Bool {
  return true
}`

      const expected = `import "UnconfiguredContract"
import FlowToken from 0x7e60df042a9c0868

access(all) fun main(): Bool {
  return true
}`

      // Spy on console.warn to verify warning is logged
      const warnSpy = jest.spyOn(console, "warn").mockImplementation()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)

      // Verify warning was logged
      expect(warnSpy).toHaveBeenCalled()
      const warnCall = warnSpy.mock.calls.find(call =>
        call.join(" ").includes("Contract Placeholder not found")
      )
      expect(warnCall).toBeDefined()
      expect(warnCall?.join(" ")).toContain("UnconfiguredContract")

      warnSpy.mockRestore()
    })

    test("legacy placeholders and string imports together should throw invariant error", async () => {
      const CADENCE = `import "FungibleToken"
import FlowToken from 0xFLOWTOKEN

access(all) fun main(): Bool {
  return true
}`

      config().put("system.contracts.FungibleToken", "0xf233dcee88fe0abe")
      config().put("0xFLOWTOKEN", "0x7e60df042a9c0868")
      await idle()

      await expect(async () => {
        await pipe([
          makeScript,
          put("ix.cadence", CADENCE),
          async ix => resolveCadence(ix, await getGlobalContext()),
        ])(initInteraction())
      }).rejects.toThrow(
        "Both account identifier and contract identifier syntax not simultaneously supported."
      )
    })

    test("legacy placeholders alone should work without string imports", async () => {
      const CADENCE = `import FlowToken from 0xFLOWTOKEN
import MyContract from 0xMYCONTRACT

access(all) fun main(): Address {
  return 0xFLOWTOKEN
}`

      const expected = `import FlowToken from 0x7e60df042a9c0868
import MyContract from 0x1234567890abcdef

access(all) fun main(): Address {
  return 0x7e60df042a9c0868
}`

      config().put("0xFLOWTOKEN", "0x7e60df042a9c0868")
      config().put("0xMYCONTRACT", "0x1234567890abcdef")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })
  })

  describe("import aliases with canonical", () => {
    test("canonical contract import (no alias)", async () => {
      const CADENCE = `import "FUSD"

access(all) fun main(): String {
  return "test"
}`

      const expected = `import FUSD from 0x9a0766d93b6608b7

access(all) fun main(): String {
  return "test"
}`

      await config().put("system.contracts.FUSD", "0x9a0766d93b6608b7")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("single aliased contract import", async () => {
      const CADENCE = `import "FUSD1"

access(all) fun main(): String {
  return "test"
}`

      const expected = `import FUSD as FUSD1 from 0xe223d8a629e49c68

access(all) fun main(): String {
  return "test"
}`

      await config().put("system.contracts.FUSD1", "0xe223d8a629e49c68")
      await config().put("system.contracts.FUSD1.canonical", "FUSD")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("multiple aliases of same canonical contract", async () => {
      const CADENCE = `import "FUSD1"
import "FUSD2"

access(all) fun main(): String {
  return "test"
}`

      const expected = `import FUSD as FUSD1 from 0xe223d8a629e49c68
import FUSD as FUSD2 from 0x0f9df91c9121c460

access(all) fun main(): String {
  return "test"
}`

      await config().put("system.contracts.FUSD1", "0xe223d8a629e49c68")
      await config().put("system.contracts.FUSD1.canonical", "FUSD")
      await config().put("system.contracts.FUSD2", "0x0f9df91c9121c460")
      await config().put("system.contracts.FUSD2.canonical", "FUSD")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })

    test("mixed canonical and alias imports", async () => {
      const CADENCE = `import "FUSD"
import "FUSD1"
import "FUSD2"

access(all) fun main(): String {
  return "test"
}`

      const expected = `import FUSD from 0x9a0766d93b6608b7
import FUSD as FUSD1 from 0xe223d8a629e49c68
import FUSD as FUSD2 from 0x0f9df91c9121c460

access(all) fun main(): String {
  return "test"
}`

      await config().put("system.contracts.FUSD", "0x9a0766d93b6608b7")
      await config().put("system.contracts.FUSD1", "0xe223d8a629e49c68")
      await config().put("system.contracts.FUSD1.canonical", "FUSD")
      await config().put("system.contracts.FUSD2", "0x0f9df91c9121c460")
      await config().put("system.contracts.FUSD2.canonical", "FUSD")
      await idle()

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })
  })

  describe("no imports", () => {
    test("cadence with no imports should remain unchanged", async () => {
      const CADENCE = `access(all) fun main(): String {
  return "Hello, Flow!"
}`

      const expected = `access(all) fun main(): String {
  return "Hello, Flow!"
}`

      const ix = await pipe([
        makeScript,
        put("ix.cadence", CADENCE),
        async ix => resolveCadence(ix, await getGlobalContext()),
      ])(initInteraction())

      expect(ix.message.cadence).toEqual(expected)
    })
  })
})
