import {interaction} from "../interaction/interaction"
import {subscribeEvents} from "./build-subscribe-events"

describe("Subscribe Events", () => {
  test("Subscribe Events", async () => {
    let ix = await subscribeEvents({
      startBlockId: "abc123",
      startHeight: 1,
      eventTypes: ["A.7e60df042a9c0868.FlowToken.TokensWithdrawn"],
      addresses: ["0x1", "0x2"],
      contracts: ["A.7e60df042a9c0868.FlowToken"],
      heartbeatInterval: 1000,
    })(interaction())

    expect(ix.subscribeEvents.startBlockId).toBe("abc123")
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
})
