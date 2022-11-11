import {interaction, isGetEvents} from "../interaction/interaction"
import {getEventsAtBlockIds} from "./build-get-events-at-block-ids"

describe("Build Get Events At Block Ids", () => {
  test("Get Events At Block Ids", async () => {
    const eventName = "MyEvent"
    const blockIds = ["abc", "123"]

    let ix = await getEventsAtBlockIds(eventName, blockIds)(interaction())

    expect(isGetEvents(ix)).toBe(true)
    expect(ix.events.eventType).toBe(eventName)
    expect(ix.events.blockIds).toBe(blockIds)
  })
})
