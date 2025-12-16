import {authenticatedUser, defaultUser} from "./user"
import type {FlowClientCore} from "@onflow/fcl-core"
import {tx as realTx} from "@onflow/fcl-core"

const sharedSubscribe = jest.fn(callback => {
  callback({
    "accessNode.api": "http://localhost:8080",
    "app.detail.title": "Test App",
  })
  return () => {}
})

let currentUserState = defaultUser

export const createMockFclInstance = () => {
  // Store the response that will be returned by send/decode
  let mockSendResponse: any = {}

  let mockTxResponse = {
    snapshot: jest.fn(),
    subscribe: jest.fn(),
    onceFinalized: jest.fn(),
    onceExecuted: jest.fn(),
    onceSealed: jest.fn(),
  }
  const mockTx = Object.assign(jest.fn().mockReturnValue(mockTxResponse), {
    // Use real transaction status helpers from fcl-core
    isUnknown: jest.fn().mockImplementation(realTx.isUnknown),
    isPending: jest.fn().mockImplementation(realTx.isPending),
    isFinalized: jest.fn().mockImplementation(realTx.isFinalized),
    isExecuted: jest.fn().mockImplementation(realTx.isExecuted),
    isSealed: jest.fn().mockImplementation(realTx.isSealed),
    isExpired: jest.fn().mockImplementation(realTx.isExpired),
  })

  const mockCurrentUser = {
    subscribe: jest.fn().mockImplementation((callback: any) => {
      callback(currentUserState)
      return () => {}
    }),
    snapshot: async () => currentUserState,
    authenticate: jest.fn().mockImplementation(() => {
      currentUserState = authenticatedUser
      return Promise.resolve(authenticatedUser)
    }),
    unauthenticate: jest.fn().mockImplementation(() => {
      currentUserState = defaultUser
    }),
    authorization: jest.fn(),
    signUserMessage: jest.fn().mockImplementation(() => {
      return Promise.resolve("signedMessage")
    }),
    resolveArgument: jest.fn(),
  }

  const mockFclInstance: jest.Mocked<FlowClientCore> = {
    account: jest.fn(),
    block: jest.fn(),
    events: jest.fn(),
    mutate: jest.fn(),
    query: jest.fn(),
    queryRaw: jest.fn(),
    tx: mockTx,
    send: jest.fn().mockImplementation(args => {
      // The real FCL returns a promise that can be chained with .then(fcl.decode)
      return Promise.resolve(mockSendResponse)
    }),
    decode: jest.fn().mockImplementation(result => {
      return Promise.resolve(result)
    }),

    currentUser: mockCurrentUser,
    authenticate: jest.fn().mockImplementation(() => {
      currentUserState = authenticatedUser
      return Promise.resolve(authenticatedUser)
    }),
    unauthenticate: jest.fn().mockImplementation(() => {
      currentUserState = defaultUser
    }),
    getChainId: jest.fn().mockResolvedValue("mainnet"),
    getTransaction: jest.fn().mockImplementation((txId: string) => {
      // Make getTransaction set the response that send/decode will return
      return Promise.resolve(mockSendResponse)
    }),
    subscribe: jest.fn(),
    subscribeRaw: jest.fn(),
    resolve: jest.fn(),
    verifyUserSignatures: jest
      .fn()
      .mockRejectedValue(new Error("Not implemented")),
    signUserMessage: mockCurrentUser.signUserMessage,
    serialize: jest.fn(),
  }

  return {
    mockFclInstance,
    mockTx,
    // Helper to set what send/decode should return
    setMockSendResponse: (response: any) => {
      mockSendResponse = response
    },
  }
}

export type MockFclInstance = ReturnType<typeof createMockFclInstance>
