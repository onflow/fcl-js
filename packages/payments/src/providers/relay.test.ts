import {relayProvider} from "./relay"
import {CryptoFundingIntent} from "../types"

describe("relayProvider", () => {
  let fetchSpy: jest.SpyInstance

  const mockFlowClient = {
    getChainId: jest.fn().mockResolvedValue("mainnet"),
  } as any

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch")
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  it("should create a provider with default config", () => {
    const providerFactory = relayProvider()
    const provider = providerFactory({flowClient: mockFlowClient})
    expect(provider.id).toBe("relay")
    expect(provider.getCapabilities).toBeInstanceOf(Function)
    expect(provider.startSession).toBeInstanceOf(Function)
  })

  it("should create a provider with custom apiUrl", () => {
    const providerFactory = relayProvider({apiUrl: "https://custom.api"})
    const provider = providerFactory({flowClient: mockFlowClient})
    expect(provider.id).toBe("relay")
  })

  describe("getCapabilities", () => {
    it("should fetch capabilities from Relay API", async () => {
      const mockChains = {
        chains: [
          {
            id: 1,
            name: "Ethereum",
            depositEnabled: true,
            disabled: false,
            erc20Currencies: [
              {symbol: "USDC", address: "0x...", supportsBridging: true},
            ],
          },
          {
            id: 8453,
            name: "Base",
            depositEnabled: true,
            disabled: false,
            erc20Currencies: [
              {symbol: "USDC", address: "0x...", supportsBridging: true},
            ],
          },
          {
            id: 747,
            name: "Flow EVM",
            depositEnabled: true,
            disabled: false,
            erc20Currencies: [
              {symbol: "USDC", address: "0x...", supportsBridging: true},
            ],
          },
        ],
      }

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockChains,
      })

      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})
      const capabilities = await provider.getCapabilities()

      expect(capabilities).toHaveLength(1)
      expect(capabilities[0].type).toBe("crypto")

      const cryptoCap = capabilities[0]
      if (cryptoCap.type === "crypto") {
        expect(cryptoCap.sourceChains).toContain("eip155:1")
        expect(cryptoCap.sourceChains).toContain("eip155:8453")
        expect(cryptoCap.sourceChains).toContain("eip155:747")
        expect(cryptoCap.sourceCurrencies).toContain("USDC")
        expect(cryptoCap.currencies).toContain("USDC")
      }
    })

    it("should filter out disabled chains", async () => {
      const mockChains = {
        chains: [
          {
            id: 1,
            depositEnabled: true,
            disabled: false,
            erc20Currencies: [{symbol: "USDC", supportsBridging: true}],
          },
          {
            id: 999,
            depositEnabled: false, // Not enabled
            disabled: false,
            erc20Currencies: [{symbol: "USDC", supportsBridging: true}],
          },
        ],
      }

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockChains,
      })

      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})
      const capabilities = await provider.getCapabilities()

      const cryptoCap = capabilities[0]
      if (cryptoCap.type === "crypto") {
        expect(cryptoCap.sourceChains).toContain("eip155:1")
        expect(cryptoCap.sourceChains).not.toContain("eip155:999")
      }
    })

    it("should throw if API fails", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})

      await expect(provider.getCapabilities()).rejects.toThrow(
        "Failed to fetch Relay chains"
      )
    })
  })

  describe("startSession", () => {
    it("should reject fiat intents", async () => {
      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})

      await expect(
        provider.startSession({
          kind: "fiat",
          destination: "eip155:1:0x123",
          currency: "USD",
          paymentType: "card",
        })
      ).rejects.toThrow("Fiat not supported")
    })

    it("should reject Cadence destinations", async () => {
      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:747:0x8c5303eaa26202d6", // Cadence address (16 hex chars)
        currency: "USDC",
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      await expect(provider.startSession(intent)).rejects.toThrow(
        "Cadence destination detected"
      )
    })

    it("should create session with symbol resolution", async () => {
      // Mock currencies API for symbol lookup
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            currencies: [
              {
                symbol: "USDC",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                decimals: 6,
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            currencies: [
              {
                symbol: "USDC",
                address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                decimals: 6,
              },
            ],
          }),
        })
        // Mock quote API
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            steps: [
              {
                id: "deposit",
                depositAddress: "0xDEPOSITADDRESS1234567890123456789012",
              },
            ],
          }),
        })

      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:8453:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd",
        currency: "USDC",
        amount: "1000.0", // Human-readable: 1000 USDC
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      const session = await provider.startSession(intent)

      expect(session.kind).toBe("crypto")
      expect(session.providerId).toBe("relay")
      if (session.kind === "crypto") {
        expect(session.instructions.address).toBe(
          "0xDEPOSITADDRESS1234567890123456789012"
        )
      }
    })

    it("should create session with explicit addresses", async () => {
      // Mock currencies API for decimal lookup (even with addresses, we need decimals)
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            currencies: [
              {
                symbol: "USDC",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                decimals: 6,
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            currencies: [
              {
                symbol: "USDC",
                address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                decimals: 6,
              },
            ],
          }),
        })
        // Mock quote API
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            steps: [
              {
                id: "deposit",
                depositAddress: "0xDEPOSITADDRESS1234567890123456789012",
              },
            ],
          }),
        })

      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:8453:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd",
        currency: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // Direct address
        amount: "1000.0", // Human-readable: 1000 USDC
        sourceChain: "eip155:1",
        sourceCurrency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Direct address
      }

      const session = await provider.startSession(intent)

      expect(session.kind).toBe("crypto")
      if (session.kind === "crypto") {
        expect(session.instructions.address).toBe(
          "0xDEPOSITADDRESS1234567890123456789012"
        )
      }
    })

    it("should throw if deposit address not found in response", async () => {
      // Mock currencies API
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            currencies: [
              {
                symbol: "USDC",
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                decimals: 6,
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            currencies: [
              {
                symbol: "USDC",
                address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                decimals: 6,
              },
            ],
          }),
        })
        // Mock quote API with no deposit address
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            steps: [{id: "something", action: "do stuff"}],
          }),
        })

      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})
      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:8453:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd",
        currency: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        sourceChain: "eip155:1",
        sourceCurrency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      }

      await expect(provider.startSession(intent)).rejects.toThrow(
        "No deposit address found"
      )
    })
  })

  describe("Flow EVM decimals", () => {
    it("should fetch decimals from Relay API for all tokens", async () => {
      const providerFactory = relayProvider()
      const provider = providerFactory({flowClient: mockFlowClient})

      // Mock Relay API responses
      fetchSpy.mockImplementation((url: string | Request | URL) => {
        const urlString = url.toString()

        if (urlString.includes("/chains")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve([
                {
                  id: "1",
                  name: "Ethereum",
                  depositEnabled: true,
                  erc20Currencies: [
                    {
                      symbol: "USDC",
                      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                      decimals: 6,
                    },
                  ],
                },
                {
                  id: "747",
                  name: "Flow EVM",
                  depositEnabled: true,
                  erc20Currencies: [
                    {
                      symbol: "FLOW",
                      address: "0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e",
                      decimals: 18,
                    },
                  ],
                },
              ]),
          } as Response)
        }

        if (urlString.includes("/currencies")) {
          const urlObj = new URL(urlString)
          const chainId = urlObj.searchParams.get("chainId")

          if (chainId === "1") {
            return Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve([
                  {
                    symbol: "USDC",
                    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    decimals: 6,
                  },
                ]),
            } as Response)
          } else if (chainId === "747") {
            return Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve([
                  {
                    symbol: "FLOW",
                    address: "0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e",
                    decimals: 18,
                  },
                ]),
            } as Response)
          }
        }

        if (urlString.includes("/quote")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                steps: [
                  {
                    id: "deposit",
                    action: "Deposit",
                    depositAddress:
                      "0x1234567890123456789012345678901234567890",
                  },
                ],
              }),
          } as Response)
        }

        return Promise.reject(new Error("Unexpected fetch"))
      })

      const intent: CryptoFundingIntent = {
        kind: "crypto",
        destination: "eip155:747:0xF0AE622e463fa757Cf72243569E18Be7Df1996cd",
        currency: "0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e", // Flow token on Flow EVM
        amount: "1.5", // 1.5 FLOW
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      const session = await provider.startSession(intent)

      expect(session.kind).toBe("crypto")
      if (session.kind === "crypto") {
        expect(session.instructions.address).toBe(
          "0x1234567890123456789012345678901234567890"
        )
      }
    })
  })
})
