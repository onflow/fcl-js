import {createPaymentsClient} from "./client"
import {FundingProvider, FundingIntent, FundingSession} from "./types"

describe("createPaymentsClient", () => {
  const mockFlowClient = {
    getChainId: jest.fn().mockResolvedValue("747"),
    query: jest.fn().mockResolvedValue(null),
  } as any

  it("should create a client with createSession method", () => {
    const mockProvider: FundingProvider = {
      id: "mock",
      getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
      startSession: jest.fn(),
    }

    const client = createPaymentsClient({
      providers: [mockProvider],
      flowClient: mockFlowClient,
    })
    expect(client.createSession).toBeInstanceOf(Function)
  })

  it("should call first provider's startSession", async () => {
    const mockSession: FundingSession = {
      id: "test-123",
      providerId: "mock",
      kind: "crypto",
      instructions: {address: "0x123"},
    }

    const mockProvider: FundingProvider = {
      id: "mock",
      getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
      startSession: jest.fn().mockResolvedValue(mockSession),
    }

    const client = createPaymentsClient({
      providers: [mockProvider],
      flowClient: mockFlowClient,
    })
    const intent: FundingIntent = {
      kind: "crypto",
      destination: "eip155:1:0x123",
      currency: "USDC",
      sourceChain: "eip155:1",
      sourceCurrency: "USDC",
    }

    const result = await client.createSession(intent)

    expect(mockProvider.startSession).toHaveBeenCalledWith(intent)
    expect(result).toEqual(mockSession)
  })

  it("should try next provider if first fails", async () => {
    const mockSession: FundingSession = {
      id: "test-456",
      providerId: "provider2",
      kind: "crypto",
      instructions: {address: "0x456"},
    }

    const failingProvider: FundingProvider = {
      id: "failing",
      getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
      startSession: jest.fn().mockRejectedValue(new Error("Provider 1 failed")),
    }

    const workingProvider: FundingProvider = {
      id: "provider2",
      getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
      startSession: jest.fn().mockResolvedValue(mockSession),
    }

    const client = createPaymentsClient({
      providers: [failingProvider, workingProvider],
      flowClient: mockFlowClient,
    })
    const intent: FundingIntent = {
      kind: "crypto",
      destination: "eip155:1:0x123",
      currency: "USDC",
      sourceChain: "eip155:1",
      sourceCurrency: "USDC",
    }

    const result = await client.createSession(intent)

    expect(failingProvider.startSession).toHaveBeenCalled()
    expect(workingProvider.startSession).toHaveBeenCalled()
    expect(result).toEqual(mockSession)
  })

  it("should throw if all providers fail", async () => {
    const provider1: FundingProvider = {
      id: "provider1",
      getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
      startSession: jest.fn().mockRejectedValue(new Error("Error 1")),
    }

    const provider2: FundingProvider = {
      id: "provider2",
      getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
      startSession: jest.fn().mockRejectedValue(new Error("Error 2")),
    }

    const client = createPaymentsClient({
      providers: [provider1, provider2],
      flowClient: mockFlowClient,
    })
    const intent: FundingIntent = {
      kind: "crypto",
      destination: "eip155:1:0x123",
      currency: "USDC",
      sourceChain: "eip155:1",
      sourceCurrency: "USDC",
    }

    await expect(client.createSession(intent)).rejects.toThrow("Error 2")
  })

  it("should throw if no providers are given", async () => {
    const client = createPaymentsClient({
      providers: [],
      flowClient: mockFlowClient,
    })
    const intent: FundingIntent = {
      kind: "crypto",
      destination: "eip155:1:0x123",
      currency: "USDC",
      sourceChain: "eip155:1",
      sourceCurrency: "USDC",
    }

    await expect(client.createSession(intent)).rejects.toThrow(
      "No provider could create a session"
    )
  })

  describe("provider selection behavior", () => {
    it("should use first provider when multiple support the same intent", async () => {
      const session1: FundingSession = {
        id: "provider1-session",
        providerId: "provider1",
        kind: "crypto",
        instructions: {address: "0x111"},
      }

      const session2: FundingSession = {
        id: "provider2-session",
        providerId: "provider2",
        kind: "crypto",
        instructions: {address: "0x222"},
      }

      const provider1: FundingProvider = {
        id: "provider1",
        getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
        startSession: jest.fn().mockResolvedValue(session1),
      }

      const provider2: FundingProvider = {
        id: "provider2",
        getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
        startSession: jest.fn().mockResolvedValue(session2),
      }

      const client = createPaymentsClient({
        providers: [provider1, provider2],
        flowClient: mockFlowClient,
      })
      const intent: FundingIntent = {
        kind: "crypto",
        destination: "eip155:1:0x123",
        currency: "USDC",
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      const result = await client.createSession(intent)

      expect(result).toEqual(session1)
      expect(provider1.startSession).toHaveBeenCalledTimes(1)
      expect(provider2.startSession).not.toHaveBeenCalled()
    })

    it("should handle fiat intents with fiat provider", async () => {
      const fiatSession: FundingSession = {
        id: "fiat-123",
        providerId: "moonpay",
        kind: "fiat",
        instructions: {url: "https://buy.moonpay.com/..."},
      }

      const fiatProvider: FundingProvider = {
        id: "moonpay",
        getCapabilities: jest.fn().mockResolvedValue([{type: "fiat"}]),
        startSession: jest.fn().mockResolvedValue(fiatSession),
      }

      const client = createPaymentsClient({
        providers: [fiatProvider],
        flowClient: mockFlowClient,
      })
      const intent: FundingIntent = {
        kind: "fiat",
        destination: "eip155:1:0x123",
        currency: "USDC",
        paymentType: "card",
      }

      const result = await client.createSession(intent)

      expect(result).toEqual(fiatSession)
      expect(result.kind).toBe("fiat")
      if (result.kind === "fiat") {
        expect(result.instructions.url).toBeTruthy()
      }
    })

    it("should not maintain state between calls", async () => {
      const session1: FundingSession = {
        id: "session-1",
        providerId: "provider",
        kind: "crypto",
        instructions: {address: "0x111"},
      }

      const session2: FundingSession = {
        id: "session-2",
        providerId: "provider",
        kind: "crypto",
        instructions: {address: "0x222"},
      }

      const mockProvider: FundingProvider = {
        id: "provider",
        getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
        startSession: jest
          .fn()
          .mockResolvedValueOnce(session1)
          .mockResolvedValueOnce(session2),
      }

      const client = createPaymentsClient({
        providers: [mockProvider],
        flowClient: mockFlowClient,
      })
      const intent: FundingIntent = {
        kind: "crypto",
        destination: "eip155:1:0x123",
        currency: "USDC",
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      const result1 = await client.createSession(intent)
      const result2 = await client.createSession(intent)

      expect(result1.id).toBe("session-1")
      expect(result2.id).toBe("session-2")
      expect(mockProvider.startSession).toHaveBeenCalledTimes(2)
    })

    it("should pass intent through unchanged to provider", async () => {
      const mockSession: FundingSession = {
        id: "test",
        providerId: "mock",
        kind: "crypto",
        instructions: {address: "0x123"},
      }

      const mockProvider: FundingProvider = {
        id: "mock",
        getCapabilities: jest.fn().mockResolvedValue([{type: "crypto"}]),
        startSession: jest.fn().mockResolvedValue(mockSession),
      }

      const client = createPaymentsClient({
        providers: [mockProvider],
        flowClient: mockFlowClient,
      })
      const intent: FundingIntent = {
        kind: "crypto",
        destination: "eip155:747:0xRecipient",
        currency: "USDC",
        amount: "1000000",
        sourceChain: "eip155:1",
        sourceCurrency: "USDC",
      }

      await client.createSession(intent)

      expect(mockProvider.startSession).toHaveBeenCalledWith(intent)
    })
  })
})
