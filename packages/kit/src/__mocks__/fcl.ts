import * as actualFcl from "@onflow/fcl"

const sharedSubscribe = jest.fn(callback => {
  callback({
    "accessNode.api": "http://localhost:8080",
    "app.detail.title": "Test App",
  })
  return () => {}
})

export default {
  ...actualFcl,
  account: jest.fn(),
  block: jest.fn(),
  events: jest.fn(),
  mutate: jest.fn(),
  query: jest.fn(),
  tx: jest.fn(),
  config: () => ({
    subscribe: sharedSubscribe,
    load: jest.fn(),
  }),

  TransactionError: {
    fromErrorMessage: (errorMessage: string) => {
      return new Error(errorMessage)
    },
  },
}
