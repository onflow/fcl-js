import {createMockFclInstance} from "./flow-client"
import {authenticatedUser, defaultUser} from "./user"

const sharedSubscribe = jest.fn(callback => {
  callback({
    "accessNode.api": "http://localhost:8080",
    "app.detail.title": "Test App",
  })
  return () => {}
})

let currentUserState = defaultUser

export default {
  ...jest.requireActual("@onflow/fcl"),
  account: jest.fn(),
  block: jest.fn(),
  events: jest.fn(),
  mutate: jest.fn(),
  query: jest.fn(),
  queryRaw: jest.fn(),
  tx: jest.fn(),
  send: jest.fn().mockImplementation(args => {
    // The real FCL returns an object that allows chaining with .then(fcl.decode)
    return {
      then: (callback: (value: any) => any) => callback({}),
    }
  }),
  decode: jest.fn().mockImplementation(result => {
    return result
  }),
  getTransaction: jest.fn().mockImplementation(txId => {
    return {
      /* Mock transaction request object */
    }
  }),
  config: () => ({
    subscribe: sharedSubscribe,
    load: jest.fn(),
  }),

  currentUser: {
    subscribe: jest.fn().mockImplementation((callback: any) => {
      callback(currentUserState)
      return () => {}
    }),
    snapshot: () => currentUserState,
  },
  authenticate: jest.fn().mockImplementation(() => {
    currentUserState = authenticatedUser
    return Promise.resolve(authenticatedUser)
  }),
  unauthenticate: jest.fn().mockImplementation(() => {
    currentUserState = defaultUser
  }),
  getChainId: jest.fn().mockResolvedValue("mainnet"),

  TransactionError: {
    fromErrorMessage: (errorMessage: string) => {
      return new Error(errorMessage)
    },
  },

  createFlowClient: jest.fn(),
}
