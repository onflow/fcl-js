import {pipe} from "@qvvg/mario"
import {makeGetEvents} from "@onflow/interaction"
import {put} from "@onflow/assigns"

export const getEvents = (eventType, startBlock, endBlock) =>
  pipe([
    makeGetEvents,
    put("eventType", eventType),
    put("startBlock", startBlock),
    put("endBlock", endBlock),
  ])
