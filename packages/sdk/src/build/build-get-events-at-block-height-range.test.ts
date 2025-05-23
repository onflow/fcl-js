import {initInteraction, isGetEvents} from "../interaction/interaction"
import {getEventsAtBlockHeightRange} from "./build-get-events-at-block-height-range"

describe("Build Get Events At Block Height Range", () => {
  test("Get Events At Block Height Range", async () => {
    const eventName = "MyEvent"
    const start = 123
    const end = 456

    let ix = await getEventsAtBlockHeightRange(
      eventName,
      start,
      end
    )(initInteraction())

    expect(isGetEvents(ix)).toBe(true)
    expect(ix.events.eventType).toBe(eventName)
    expect(ix.events.start).toBe(start)
    expect(ix.events.end).toBe(end)
  })
})
