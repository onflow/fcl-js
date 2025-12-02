/**
 * Type validation tests
 * Ensures discriminated unions work correctly
 */

import {
  CryptoFundingIntent,
  FiatFundingIntent,
  FundingIntent,
  CryptoFundingSession,
  FiatFundingSession,
  FundingSession,
  CryptoProviderCapability,
  FiatProviderCapability,
} from "./types"
import {VM} from "./constants"

describe("Type definitions", () => {
  describe("FundingIntent discriminated unions", () => {
    it("should narrow CryptoFundingIntent by kind", () => {
      const intent: FundingIntent = {
        kind: "crypto",
        destination: "eip155:1:0x1234567890123456789012345678901234567890",
        currency: "USDC",
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      if (intent.kind === "crypto") {
        expect(intent.sourceChain).toBeTruthy()
        expect(intent.sourceCurrency).toBeTruthy()
      }
    })

    it("should narrow FiatFundingIntent by kind", () => {
      const intent: FundingIntent = {
        kind: "fiat",
        destination: "eip155:1:0x1234567890123456789012345678901234567890",
        currency: "USD",
        paymentType: "card",
      }

      if (intent.kind === "fiat") {
        expect(intent.paymentType).toBe("card")
      }
    })
  })

  describe("FundingSession discriminated unions", () => {
    it("should narrow CryptoFundingSession by kind", () => {
      const session: FundingSession = {
        id: "session-123",
        providerId: "relay",
        kind: "crypto",
        instructions: {
          address: "0x1234567890123456789012345678901234567890",
          memo: "12345",
        },
      }

      if (session.kind === "crypto") {
        expect(session.instructions.address).toBeTruthy()
        expect(session.instructions.memo).toBe("12345")
      }
    })

    it("should narrow FiatFundingSession by kind", () => {
      const session: FundingSession = {
        id: "session-456",
        providerId: "moonpay",
        kind: "fiat",
        instructions: {
          url: "https://buy.moonpay.com/...",
          providerName: "MoonPay",
        },
      }

      if (session.kind === "fiat") {
        expect(session.instructions.url).toBeTruthy()
        expect(session.instructions.providerName).toBe("MoonPay")
      }
    })
  })

  describe("ProviderCapability discriminated unions", () => {
    it("should narrow CryptoProviderCapability by type", () => {
      const capability: CryptoProviderCapability = {
        type: "crypto",
        sourceChains: ["eip155:1", "eip155:137"],
        sourceCurrencies: ["USDC", "ETH"],
        currencies: ["USDC", "FLOW"],
        minAmount: "1000000",
        maxAmount: "1000000000000",
      }

      if (capability.type === "crypto") {
        expect(capability.sourceChains).toHaveLength(2)
        expect(capability.minAmount).toBe("1000000")
      }
    })

    it("should narrow FiatProviderCapability by type", () => {
      const capability: FiatProviderCapability = {
        type: "fiat",
        paymentTypes: ["card", "bank_transfer"],
        currencies: ["USD", "EUR"],
      }

      if (capability.type === "fiat") {
        expect(capability.paymentTypes).toContain("card")
      }
    })
  })
})
