import {subscribe} from "@onflow/sdk"
import {SubscriptionsNotSupportedError} from "@onflow/sdk"
import {SubscriptionTopic, TransactionExecutionStatus} from "@onflow/typedefs"
import {transaction} from "./transaction"
import {transaction as legacyTransaction} from "./legacy-polling"
import {createGetChainId} from "../utils"

jest.mock("@onflow/sdk")
jest.mock("./legacy-polling")
jest.mock("../utils")

describe("transaction", () => {
  let mockGetChainId: jest.MockedFunction<() => Promise<string>>
  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(subscribe).mockReturnValue({
      unsubscribe: jest.fn(),
    })

    jest.mocked(legacyTransaction).mockReturnValue({
      subscribe: jest.fn(),
      onceExecuted: jest.fn(),
      onceSealed: jest.fn(),
      onceFinalized: jest.fn(),
      snapshot: jest.fn(),
    })

    mockGetChainId = jest.fn().mockResolvedValue("mainnet")
    jest.mocked(createGetChainId).mockReturnValue(mockGetChainId)
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

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    // Expect the subscribe method to be called with the correct parameters
    const subscribeParams = jest.mocked(subscribe).mock
      .calls[0][0] as Parameters<
      typeof subscribe<SubscriptionTopic.TRANSACTION_STATUSES>
    >[0]

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
          blockId: "",
          status: TransactionExecutionStatus.UNKNOWN,
          statusString: "",
          statusCode: 0,
          errorMessage: "",
          events: [],
        },
      ],
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
    const txId = "INVALID_TRANSACTION_ID"

    expect(() => transaction(txId)).toThrow("Invalid transactionId")
  })

  test("should unsubscribe once the transaction has sealed", async () => {
    jest.resetModules()
    const txId =
      "4234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const callback = jest.fn()
    transaction(txId).subscribe(callback)

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    // Mock the observable to emit a SEALED status
    const subscribeParams = jest.mocked(subscribe).mock
      .calls[0][0] as Parameters<
      typeof subscribe<SubscriptionTopic.TRANSACTION_STATUSES>
    >[0]

    subscribeParams.onData({
      status: TransactionExecutionStatus.PENDING,
      blockId: "",
      statusCode: 0,
      errorMessage: "",
      events: [],
      statusString: "PENDING",
    })

    subscribeParams.onData({
      status: TransactionExecutionStatus.SEALED,
      blockId: "",
      statusCode: 0,
      errorMessage: "",
      events: [],
      statusString: "SEALED",
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    const unsubMock = jest.mocked(subscribe).mock.results[0].value
    expect(unsubMock.unsubscribe).toHaveBeenCalledTimes(1)
  })

  test("subscribe should fallback to polling if real-time streaming is not supported", async () => {
    const txId =
      "2234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const onData = jest.fn()
    const onError = jest.fn()
    const unsubscribe = transaction(txId).subscribe(onData, onError)

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    // Expect the subscribe method to be called with the correct parameters
    const subscribeParams = jest.mocked(subscribe).mock
      .calls[0][0] as Parameters<
      typeof subscribe<SubscriptionTopic.TRANSACTION_STATUSES>
    >[0]

    expect(subscribeParams).toStrictEqual({
      topic: SubscriptionTopic.TRANSACTION_STATUSES,
      args: {transactionId: txId},
      onData: expect.any(Function),
      onError: expect.any(Function),
    })

    // Mock the observable to emit an error
    subscribeParams.onError(new SubscriptionsNotSupportedError())

    // Expect the error to be reported
    expect(onData.mock.calls).toStrictEqual([
      [
        {
          blockId: "",
          status: TransactionExecutionStatus.UNKNOWN,
          statusString: "",
          statusCode: 0,
          errorMessage: "",
          events: [],
        },
      ],
    ])
    expect(onError).not.toHaveBeenCalled()

    expect(legacyTransaction).toHaveBeenCalledWith(txId, {
      pollRate: 1000,
      txNotFoundTimeout: 12500,
    })

    unsubscribe()
  })

  test("should fall back to legacy polling if the Flow emulator is detected", async () => {
    mockGetChainId.mockResolvedValue("local")

    const txId =
      "3234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const onData = jest.fn()
    const onError = jest.fn()
    const unsubscribe = transaction(txId).subscribe(onData, onError)

    // Flush the event loop
    await new Promise(resolve => setTimeout(resolve, 0))

    // Expect legacy polling to be called
    expect(subscribe).not.toHaveBeenCalled()
    expect(legacyTransaction).toHaveBeenCalledWith(txId, {
      pollRate: 1000,
      txNotFoundTimeout: 12500,
    })

    // Expect the legacy subscribe method to be called with the correct parameters
    const legacySubscribe =
      jest.mocked(legacyTransaction).mock.results[0].value.subscribe
    expect(legacySubscribe).toHaveBeenCalledTimes(1)
    expect(legacySubscribe).toHaveBeenCalledWith(expect.any(Function))

    // Get the callback function
    const legacyCallback = legacySubscribe.mock.calls[0][0]

    // Mock the observable to emit a PENDING status
    legacyCallback(
      {
        blockId: "",
        status: TransactionExecutionStatus.PENDING,
        statusString: "PENDING",
        statusCode: 0,
        errorMessage: "",
        events: [],
      },
      null
    )

    // Expect the error to be reported
    expect(onData.mock.calls).toStrictEqual([
      [
        {
          blockId: "",
          status: TransactionExecutionStatus.UNKNOWN,
          statusString: "",
          statusCode: 0,
          errorMessage: "",
          events: [],
        },
      ],
      [
        {
          blockId: "",
          status: TransactionExecutionStatus.PENDING,
          statusString: "PENDING",
          statusCode: 0,
          errorMessage: "",
          events: [],
        },
      ],
    ])
    expect(onError).not.toHaveBeenCalled()

    expect(legacyTransaction).toHaveBeenCalledWith(txId, {
      pollRate: 1000,
      txNotFoundTimeout: 12500,
    })

    unsubscribe()
  })
})
