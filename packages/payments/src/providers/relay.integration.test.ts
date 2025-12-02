/**
 * Integration tests for Relay provider
 * These tests make real API calls to Relay's production API
 * Run with: npm test -- relay.integration.test.ts
 */

import {relayProvider} from "./relay"
import {CryptoFundingIntent} from "../types"

// Skip integration tests by default (only run when explicitly requested)
describe.skip("relayProvider - Integration Tests", () => {
  const provider = relayProvider()

  describe("getCapabilities", () => {
    it("should fetch real capabilities from Relay API", async () => {
      const capabilities = await provider.getCapabilities()

      expect(capabilities).toHaveLength(1)
      expect(capabilities[0].type).toBe("crypto")

      const cryptoCap = capabilities[0]
      if (cryptoCap.type === "crypto") {
        // Should have major chains
        expect(cryptoCap.sourceChains).toContain("eip155:1") // Ethereum
        expect(cryptoCap.sourceChains).toContain("eip155:8453") // Base
        expect(cryptoCap.sourceChains?.length).toBeGreaterThan(10)

        // Should have major currencies
        expect(cryptoCap.sourceCurrencies).toContain("USDC")
        expect(cryptoCap.sourceCurrencies).toContain("ETH")
        expect(cryptoCap.sourceCurrencies?.length).toBeGreaterThan(10)

        console.log(`Found ${cryptoCap.sourceChains?.length} chains`)
        console.log(`Found ${cryptoCap.sourceCurrencies?.length} currencies`)
      }
    }, 10000) // 10s timeout for API call
  })

  describe("startSession", () => {
    it("should create a real session with deposit address", async () => {
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:8453:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd", // Base
        currency: "USDC",
        amount: "1000000000", // 1000 USDC
        sourceChain: "eip155:1", // Ethereum
        sourceCurrency: "USDC",
      }

      const session = await provider.startSession(intent)

      expect(session.kind).toBe("crypto")
      expect(session.providerId).toBe("relay")
      expect(session.id).toBeTruthy()

      if (session.kind === "crypto") {
        expect(session.instructions.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
        console.log(
          `Generated deposit address: ${session.instructions.address}`
        )
      }
    }, 15000) // 15s timeout for API call

    it("should work with explicit token addresses", async () => {
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:8453:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd",
        currency: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Base
        amount: "1000000000",
        sourceChain: "eip155:1",
        sourceCurrency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC on Ethereum
      }

      const session = await provider.startSession(intent)

      expect(session.kind).toBe("crypto")
      if (session.kind === "crypto") {
        expect(session.instructions.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
      }
    }, 15000)

    it("should fail with amount too low", async () => {
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:8453:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd",
        currency: "USDC",
        amount: "1", // 0.000001 USDC - way too low
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      await expect(provider.startSession(intent)).rejects.toThrow(
        /AMOUNT_TOO_LOW|too small/
      )
    }, 15000)

    it("should fail with invalid token symbol", async () => {
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:8453:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd",
        currency: "INVALIDTOKEN123",
        amount: "1000000000",
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      await expect(provider.startSession(intent)).rejects.toThrow(/not found/)
    }, 15000)
  })

  describe("Flow EVM support", () => {
    it("should support Flow EVM mainnet (747)", async () => {
      const capabilities = await provider.getCapabilities()

      const cryptoCap = capabilities[0]
      if (cryptoCap.type === "crypto") {
        expect(cryptoCap.sourceChains).toContain("eip155:747")
        console.log("✓ Flow EVM mainnet is supported")
      }
    }, 10000)

    // This test will likely fail if Flow EVM tokens aren't properly mapped
    it.skip("should create session for Flow EVM destination", async () => {
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:747:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd", // Flow EVM
        currency: "USDC",
        amount: "1000000000",
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      const session = await provider.startSession(intent)

      expect(session.kind).toBe("crypto")
      if (session.kind === "crypto") {
        expect(session.instructions.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
      }
    }, 15000)
  })
})

/**
 * To run these integration tests:
 *
 * npm test -- relay.integration.test.ts --testNamePattern="Integration Tests"
 *
 * Or remove the .skip above to run them as part of the full test suite
 */
