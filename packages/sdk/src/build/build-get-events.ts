import {
  pipe,
  Ok,
  makeGetEvents,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns the interaction to get events.
 *
 * Events are emitted by Cadence code during transaction execution and provide insights into what happened during execution.
 * This function queries for events of a specific type within a range of block heights.
 *
 * @param eventType The type of event to get (e.g., "A.1654653399040a61.FlowToken.TokensWithdrawn")
 * @param start The start block height to query from
 * @param end The end block height to query to
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get FlowToken transfer events from blocks 1000 to 2000
 * const events = await fcl.send([
 *   fcl.getEvents("A.1654653399040a61.FlowToken.TokensDeposited", 1000, 2000)
 * ]).then(fcl.decode);
 *
 * console.log("Found events:", events.length);
 * events.forEach(event => {
 *   console.log("Event data:", event.data);
 *   console.log("Transaction ID:", event.transactionId);
 * });
 */
export function getEvents(
  eventType: string,
  start: number,
  end: number
): InteractionBuilderFn {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventType
      ix.events.start = start
      ix.events.end = end
      return Ok(ix)
    },
  ])
}
