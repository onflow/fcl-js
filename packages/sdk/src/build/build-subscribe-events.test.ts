import {interaction} from "../interaction/interaction"
import {subscribeEvents} from "./build-subscribe-events"

describe("Subscribe Events", () => {
  test("subscribe events no block", async () => {
    let ix = await subscribeEvents({
      eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
      addresses: ["0x1", "0x2"],
      contracts: ["A.7e60df042a9c0868.FlowToken"],
      heartbeatInterval: 1000,
    })(interaction())

    expect(ix.subscribeEvents.eventTypes).toEqual([
      "A.7e60df042a9c0868.FlowToken.TokensWithdrawn",
    ])
    expect(ix.subscribeEvents.addresses).toEqual(["0x1", "0x2"])
    expect(ix.subscribeEvents.contracts).toEqual([
      "A.7e60df042a9c0868.FlowToken",
    ])
    expect(ix.subscribeEvents.heartbeatInterval).toBe(1000)
  })

  test("subscribe events block height", async () => {
    let ix = await subscribeEvents({
      startHeight: 1,
      eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
      addresses: ["0x1", "0x2"],
      contracts: ["A.7e60df042a9c0868.FlowToken"],
      heartbeatInterval: 1000,
    })(interaction())

    expect(ix.subscribeEvents.startHeight).toBe(1)
    expect(ix.subscribeEvents.eventTypes).toEqual([
      "A.7e60df042a9c0868.FlowToken.TokensWithdrawn",
    ])
    expect(ix.subscribeEvents.addresses).toEqual(["0x1", "0x2"])
    expect(ix.subscribeEvents.contracts).toEqual([
      "A.7e60df042a9c0868.FlowToken",
    ])
    expect(ix.subscribeEvents.heartbeatInterval).toBe(1000)
  })

  test("subscribe events block id", async () => {
    let ix = await subscribeEvents({
      startBlockId: "abc123",
      eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
      addresses: ["0x1", "0x2"],
      contracts: ["A.7e60df042a9c0868.FlowToken"],
      heartbeatInterval: 1000,
    })(interaction())

    expect(ix.subscribeEvents.startBlockId).toBe("abc123")
    expect(ix.subscribeEvents.eventTypes).toEqual([
      "A.7e60df042a9c0868.FlowToken.TokensWithdrawn",
    ])
    expect(ix.subscribeEvents.addresses).toEqual(["0x1", "0x2"])
    expect(ix.subscribeEvents.contracts).toEqual([
      "A.7e60df042a9c0868.FlowToken",
    ])
    expect(ix.subscribeEvents.heartbeatInterval).toBe(1000)
  })

  test("throws if both startBlockId and startHeight are set", async () => {
    await expect(async () =>
      subscribeEvents({
        startBlockId: "abc123",
        startHeight: 1,
        eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
        addresses: ["0x1", "0x2"],
        contracts: ["A.7e60df042a9c0868.FlowToken"],
        heartbeatInterval: 1000,
      })
    ).rejects.toThrow(
      "INVARIANT SDK Subscribe Events Error: Cannot set both startBlockId and startHeight."
    )
  })
})
