import {sendSubscribeEvents} from "./send-subscribe-events"
import {Buffer} from "@onflow/rlp"
import {
  build,
  subscribeEvents,
  subscription,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Subscribe Events", () => {
  let subscribeWsMock

  let onData
  let onError
  let onComplete

  let unsubscribe
  let response

  beforeEach(async () => {
    subscribeWsMock = jest.fn()

    onData = jest.fn()
    onError = jest.fn()
    onComplete = jest.fn()

    unsubscribe = jest.fn()

    subscribeWsMock.mockReturnValue({
      unsubscribeCallback: unsubscribe,
    })

    const response = await sendSubscribeEvents(
      await resolve(
        await build([
          subscribeEvents({
            startBlockId: "abc123",
            startHeight: 1,
            eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
            addresses: ["0x1", "0x2"],
            contracts: ["A.7e60df042a9c0868.FlowToken"],
            heartbeatInterval: 1000,
          }),
          subscription({
            onData,
            onError,
            onComplete,
          }),
        ])
      ),
      {
        response: responseADT,
        Buffer,
      },
      {
        subscribeWs: subscribeWsMock,
        node: "localhost",
      }
    )
  })

  test("calls subscribeWs with correct params", async () => {
    expect(subscribeWsMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent.hostname).toBe("localhost")
    expect(valueSent.path).toBe("/v1/subscribe_events")
    expect(valueSent.params).toEqual({
      start_block_id: "abc123",
      start_height: 1,
      event_types: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
      addresses: ["0x1", "0x2"],
      contracts: ["A.7e60df042a9c0868.FlowToken"],
      heartbeat_interval: 1000,
    })
  })

  test("calls onData with response ADT formatted data", async () => {
    const data = {foo: "bar"}

    // Similate WS message
    subscribeWsMock.mock.calls[0][0].onData(data)

    expect(onData.mock.calls.length).toEqual(1)
    expect(onData.mock.calls[0][0]).toEqual({
      tag: "SubscribeEvents",
      data: data,
    })
  })

  test("calling response.unsubscribeCallback calls subscribeWs unsubscribe", async () => {
    response.unsubscribeCallback()

    expect(unsubscribe.mock.calls.length).toEqual(1)
  })
})
