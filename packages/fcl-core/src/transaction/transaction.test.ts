import {subscribe} from "@onflow/sdk"
import {SubscribeParams} from "@onflow/sdk/types/transport"
import {SubscriptionTopic, TransactionExecutionStatus} from "@onflow/typedefs"
import {transaction} from "./transaction"

jest.mock("@onflow/sdk")

describe("transaction", () => {
  beforeEach(() => {
    // Reset modules to clear the registry (cache) of transaction observables
    jest.resetModules()

    jest.mocked(subscribe).mockReturnValue({
      unsubscribe: jest.fn(),
    })
  })

  test("should throw an error if transactionId is not a 64 byte hash string", () => {
    const {transaction} = require("./transaction")

    const actual = () => transaction("invalid-transaction-id")
    expect(actual).toThrow("Invalid transactionId")
  })

  test("subscribe should report transaction status", async () => {
    const txId =
      "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const callback = jest.fn()
    const unsubscribe = transaction(txId).subscribe(callback)

    // Expect the subscribe method to be called with the correct parameters
    const subscribeParams = jest.mocked(subscribe).mock
      .calls[0][0] as SubscribeParams<SubscriptionTopic.TRANSACTION_STATUSES>

    expect(subscribeParams).toStrictEqual({
      topic: SubscriptionTopic.TRANSACTION_STATUSES,
      args: {transactionId: txId},
      onData: expect.any(Function),
      onError: expect.any(Function),
    })

    // Mock the observable to emit a PENDING status
    subscribeParams.onData({
      status: TransactionExecutionStatus.PENDING,
      blockId: "",
      statusCode: 0,
      errorMessage: "",
      events: [],
      statusString: "PENDING",
    })

    // Mock the observable to emit a SEALED status
    subscribeParams.onData({
      status: TransactionExecutionStatus.SEALED,
      blockId: "",
      statusCode: 0,
      errorMessage: "",
      events: [],
      statusString: "SEALED",
    })

    // Expect all subscription data to be reported
    expect(callback.mock.calls).toStrictEqual([
      [
        {
          status: TransactionExecutionStatus.PENDING,
          blockId: "",
          statusCode: 0,
          errorMessage: "",
          events: [],
          statusString: "PENDING",
        },
      ],
      [
        {
          status: TransactionExecutionStatus.SEALED,
          blockId: "",
          statusCode: 0,
          errorMessage: "",
          events: [],
          statusString: "SEALED",
        },
      ],
    ])

    unsubscribe()
  })

  test("subscribe should report an error if the transactionId is invalid", async () => {
    const txId =
      "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const callback = jest.fn()
    const unsubscribe = transaction(txId).subscribe(callback)

    // Expect the subscribe method to be called with the correct parameters
    const subscribeParams = jest.mocked(subscribe).mock
      .calls[0][0] as SubscribeParams<SubscriptionTopic.TRANSACTION_STATUSES>

    expect(subscribeParams).toStrictEqual({
      topic: SubscriptionTopic.TRANSACTION_STATUSES,
      args: {transactionId: txId},
      onData: expect.any(Function),
      onError: expect.any(Function),
    })

    // Mock the observable to emit an error
    subscribeParams.onError(new Error("Invalid transactionId"))

    // Expect the error to be reported
    expect(callback.mock.calls).toStrictEqual([
      [undefined, new Error("Invalid transactionId")],
    ])

    unsubscribe()
  })

  test("subscribe should fallback to polling if real-time streaming is not supported", async () => {
    const txId =
      "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const callback = jest.fn()
    const unsubscribe = transaction(txId).subscribe(callback)

    // Expect the subscribe method to be called with the correct parameters
    const subscribeParams = jest.mocked(subscribe).mock
      .calls[0][0] as SubscribeParams<SubscriptionTopic.TRANSACTION_STATUSES>

    expect(subscribeParams).toStrictEqual({
      topic: SubscriptionTopic.TRANSACTION_STATUSES,
      args: {transactionId: txId},
      onData: expect.any(Function),
      onError: expect.any(Function),
    })

    // Mock the observable to emit an error
    subscribeParams.onError(new Error("Subscriptions not supported"))

    // Expect the error to be reported
    expect(callback.mock.calls).toStrictEqual([
      [undefined, new Error("Subscriptions not supported")],
    ])

    unsubscribe()
  })
})
