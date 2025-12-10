import {moonpayProvider} from "./moonpay"
import type {
  FiatFundingIntent,
  CryptoFundingIntent,
  FiatFundingSession,
} from "../types"

// Mock Flow client
const mockFlowClient = {} as any

describe("moonpayProvider", () => {
  const validConfig = {
    publishableApiKey: "pk_test_123456789",
    environment: "sandbox" as const,
  }

  describe("Configuration validation", () => {
    it("should throw error if publishableApiKey is missing", () => {
      expect(() => {
        moonpayProvider({publishableApiKey: ""})
      }).toThrow("MoonPay publishableApiKey is required")
    })

    it("should throw error if API key format is invalid", () => {
      expect(() => {
        moonpayProvider({publishableApiKey: "invalid_key"})
      }).toThrow(
        "Invalid MoonPay API key format. Must start with pk_test_ or pk_live_"
      )
    })

    it("should accept pk_test_ API keys", () => {
      expect(() => {
        moonpayProvider({publishableApiKey: "pk_test_123"})
      }).not.toThrow()
    })

    it("should accept pk_live_ API keys", () => {
      expect(() => {
        moonpayProvider({publishableApiKey: "pk_live_123"})
      }).not.toThrow()
    })
  })

  describe("getCapabilities", () => {
    it("should return fiat capabilities", async () => {
      const provider = moonpayProvider(validConfig)({
        flowClient: mockFlowClient,
      })

      const capabilities = await provider.getCapabilities()

      expect(capabilities).toHaveLength(1)
      expect(capabilities[0]).toMatchObject({
        type: "fiat",
        minAmount: "30",
        maxAmount: "10000",
        paymentTypes: ["card", "bank_transfer", "apple_pay", "google_pay"],
      })
      expect(capabilities[0].currencies).toContain("flow")
    })
  })

  describe("startSession", () => {
    const provider = moonpayProvider(validConfig)({
      flowClient: mockFlowClient,
    })

    it("should reject crypto funding intents", async () => {
      const cryptoIntent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        amount: "100",
        sourceChain: "eip155:1",
        sourceCurrency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      }

      await expect(provider.startSession(cryptoIntent)).rejects.toThrow(
        "MoonPay provider only supports fiat funding"
      )
    })

    it("should reject invalid CAIP-10 destination format", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "invalid-address",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      await expect(provider.startSession(intent)).rejects.toThrow(
        "Invalid destination format"
      )
    })

    it("should generate valid session with widget URL", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session).toMatchObject({
        providerId: "moonpay",
        kind: "fiat",
        instructions: {
          providerName: "MoonPay",
        },
      })
      expect(session.id).toMatch(/^moonpay_/)
      expect(session.instructions.url).toContain("buy-sandbox.moonpay.com")
    })

    it("should extract wallet address from CAIP-10 format", async () => {
      const walletAddress = "0xabcdef1234567890123456789012345678901234"
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: `eip155:747:${walletAddress}`,
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain(
        `walletAddress=${walletAddress}`
      )
    })

    it("should include API key in URL", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain(
        `apiKey=${validConfig.publishableApiKey}`
      )
    })

    it("should include currency code in URL", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("currencyCode=flow")
    })

    it("should include amount when provided", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "250.50",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("baseCurrencyAmount=250.50")
    })

    it("should include payment type when provided", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "bank_transfer",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("paymentMethod=bank_transfer")
    })

    it("should work without optional amount", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).not.toContain("baseCurrencyAmount")
    })

    it("should work without optional payment type", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).not.toContain("paymentMethod")
    })

    it("should map EVM address to currency code", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Flow
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("currencyCode=usdc_flow")
    })

    it("should use default currency for unmapped EVM addresses", async () => {
      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "0x9999999999999999999999999999999999999999", // Unknown address
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("currencyCode=flow")
    })
  })

  describe("Environment switching", () => {
    it("should use sandbox URL for sandbox environment", async () => {
      const provider = moonpayProvider({
        publishableApiKey: "pk_test_123",
        environment: "sandbox",
      })({flowClient: mockFlowClient})

      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("buy-sandbox.moonpay.com")
    })

    it("should use production URL for production environment", async () => {
      const provider = moonpayProvider({
        publishableApiKey: "pk_live_123",
        environment: "production",
      })({flowClient: mockFlowClient})

      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("buy.moonpay.com")
      expect(session.instructions.url).not.toContain("sandbox")
    })

    it("should default to production when environment not specified", async () => {
      const provider = moonpayProvider({
        publishableApiKey: "pk_live_123",
      })({flowClient: mockFlowClient})

      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("buy.moonpay.com")
    })
  })

  describe("Optional configuration parameters", () => {
    it("should include colorCode when provided", async () => {
      const provider = moonpayProvider({
        publishableApiKey: "pk_test_123",
        colorCode: "FF5733",
      })({flowClient: mockFlowClient})

      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("colorCode=FF5733")
    })

    it("should include redirectUrl when provided", async () => {
      const redirectUrl = "https://myapp.com/payment-complete"
      const provider = moonpayProvider({
        publishableApiKey: "pk_test_123",
        redirectUrl,
      })({flowClient: mockFlowClient})

      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain(
        `redirectURL=${encodeURIComponent(redirectUrl)}`
      )
    })

    it("should include all optional parameters together", async () => {
      const config = {
        publishableApiKey: "pk_test_123",
        environment: "sandbox" as const,
        colorCode: "FF5733",
        redirectUrl: "https://myapp.com/complete",
      }
      const provider = moonpayProvider(config)({flowClient: mockFlowClient})

      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      expect(session.instructions.url).toContain("colorCode=FF5733")
      expect(session.instructions.url).toContain("redirectURL=")
      expect(session.instructions.url).toContain("buy-sandbox.moonpay.com")
    })
  })

  describe("URL encoding", () => {
    it("should properly encode special characters in redirect URL", async () => {
      const provider = moonpayProvider({
        publishableApiKey: "pk_test_123",
        redirectUrl: "https://myapp.com/complete?session=123&status=success",
      })({flowClient: mockFlowClient})

      const intent: FiatFundingIntent = {
        kind: "fiat",
        destination: "eip155:747:0x1234567890123456789012345678901234567890",
        currency: "flow",
        amount: "100",
        paymentType: "card",
      }

      const session = (await provider.startSession(
        intent
      )) as FiatFundingSession

      // URLSearchParams should handle encoding
      expect(session.instructions.url).toContain("redirectURL=")
      // The URL should be properly encoded
      const url = new URL(session.instructions.url)
      expect(url.searchParams.get("redirectURL")).toBe(
        "https://myapp.com/complete?session=123&status=success"
      )
    })
  })
})
