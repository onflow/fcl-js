import {renderHook, act} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider"
import {useFlowEvents} from "./useFlowEvents"
import {Event} from "@onflow/typedefs"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowEvents", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("subscribes to events with event name string and calls onEvent", () => {
    const mockEvent: Event = {
      type: "A.0xDeaDBeef.SomeContract.SomeEvent",
      transactionId: "tx-id",
      transactionIndex: 0,
      eventIndex: 0,
      data: {someField: "value"},
      blockId: "block-id",
      blockHeight: 100,
      blockTimestamp: "2023-01-01T00:00:00Z",
    }

    let eventCallback: (event: Event | null) => void
    const mockUnsubscribe = jest.fn()
    const mockSubscribe = jest.fn(callback => {
      eventCallback = callback
      return mockUnsubscribe
    })

    const eventsMock = jest.mocked(fcl.events)
    eventsMock.mockReturnValueOnce({subscribe: mockSubscribe})

    const onEvent = jest.fn()
    const {unmount} = renderHook(
      () => useFlowEvents("A.0xDeaDBeef.SomeContract.SomeEvent", {onEvent}),
      {wrapper: FlowProvider}
    )

    expect(fcl.events).toHaveBeenCalledWith({
      eventTypes: ["A.0xDeaDBeef.SomeContract.SomeEvent"],
    })
    expect(mockSubscribe).toHaveBeenCalled()

    act(() => {
      eventCallback(mockEvent)
    })

    expect(onEvent).toHaveBeenCalledWith(mockEvent)

    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  test("subscribes to events with EventFilter object and calls onEvent", () => {
    const mockEvent: Event = {
      type: "A.0xDeaDBeef.SomeContract.SomeEvent",
      transactionId: "tx-id",
      transactionIndex: 0,
      eventIndex: 0,
      data: {someField: "value"},
      blockId: "block-id",
      blockHeight: 100,
      blockTimestamp: "2023-01-01T00:00:00Z",
    }

    let eventCallback: (event: Event | null) => void
    const mockUnsubscribe = jest.fn()
    const mockSubscribe = jest.fn(callback => {
      eventCallback = callback
      return mockUnsubscribe
    })

    const eventsMock = jest.mocked(fcl.events)
    eventsMock.mockReturnValueOnce({subscribe: mockSubscribe})

    const filter = {
      startHeight: 100,
      eventTypes: ["A.0xDeaDBeef.SomeContract.SomeEvent"],
      addresses: ["0x1234"],
    }

    const onEvent = jest.fn()
    const {unmount} = renderHook(() => useFlowEvents(filter, {onEvent}), {
      wrapper: FlowProvider,
    })

    expect(fcl.events).toHaveBeenCalledWith(filter)
    expect(mockSubscribe).toHaveBeenCalled()

    act(() => {
      eventCallback(mockEvent)
    })

    expect(onEvent).toHaveBeenCalledWith(mockEvent)

    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  test("handles error during subscription", () => {
    const testError = new Error("Subscription failed")

    const eventsMock = jest.mocked(fcl.events)
    eventsMock.mockImplementation(() => {
      throw testError
    })

    const onEvent = jest.fn()
    const onError = jest.fn()

    renderHook(
      () =>
        useFlowEvents("A.0xDeaDBeef.SomeContract.SomeEvent", {
          onEvent,
          onError,
        }),
      {wrapper: FlowProvider}
    )

    expect(onError).toHaveBeenCalledWith(testError)
    expect(onEvent).not.toHaveBeenCalled()
  })

  test("calls onEvent multiple times for multiple events", () => {
    const mockEvent1: Event = {
      type: "A.0xDeaDBeef.SomeContract.SomeEvent",
      transactionId: "tx-id-1",
      transactionIndex: 0,
      eventIndex: 0,
      data: {someField: "value1"},
      blockId: "block-id-1",
      blockHeight: 100,
      blockTimestamp: "2023-01-01T00:00:00Z",
    }
    const mockEvent2: Event = {
      type: "A.0xDeaDBeef.SomeContract.SomeEvent",
      transactionId: "tx-id-2",
      transactionIndex: 0,
      eventIndex: 0,
      data: {someField: "value2"},
      blockId: "block-id-2",
      blockHeight: 101,
      blockTimestamp: "2023-01-01T00:01:00Z",
    }

    let eventCallback: (event: Event | null) => void
    const mockUnsubscribe = jest.fn()
    const mockSubscribe = jest.fn(callback => {
      eventCallback = callback
      return mockUnsubscribe
    })

    const eventsMock = jest.mocked(fcl.events)
    eventsMock.mockReturnValueOnce({subscribe: mockSubscribe})

    const onEvent = jest.fn()
    renderHook(
      () => useFlowEvents("A.0xDeaDBeef.SomeContract.SomeEvent", {onEvent}),
      {
        wrapper: FlowProvider,
      }
    )

    act(() => {
      eventCallback(mockEvent1)
    })
    act(() => {
      eventCallback(mockEvent2)
    })

    expect(onEvent).toHaveBeenCalledTimes(2)
    expect(onEvent).toHaveBeenCalledWith(mockEvent1)
    expect(onEvent).toHaveBeenCalledWith(mockEvent2)
  })
})
