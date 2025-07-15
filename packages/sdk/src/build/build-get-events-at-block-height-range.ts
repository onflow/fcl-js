import {
  pipe,
  Ok,
  makeGetEvents,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns all instances of a particular event (by name) within a height range.
 *
 * The block range provided must be from the current spork.
 *
 * The block range provided must be 250 blocks or lower per request.
 *
 * Event type is a string that follow a standard format: A.{AccountAddress}.{ContractName}.{EventName}
 *
 * Please read more about [events in the documentation](https://docs.onflow.org/cadence/language/events/).
 *
 * Block height range expresses the height of the start and end block in the chain.
 *
 * @param eventType The type of event to get
 * @param startHeight The height of the block to start looking for events (inclusive)
 * @param endHeight The height of the block to stop looking for events (inclusive)
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * // Get events at block height range
 * await fcl
 *   .send([
 *     fcl.getEventsAtBlockHeightRange(
 *       "A.7e60df042a9c0868.FlowToken.TokensWithdrawn", // event name
 *       35580624, // block to start looking for events at
 *       35580624 // block to stop looking for events at
 *     ),
 *   ])
 *   .then(fcl.decode);
 */
export function getEventsAtBlockHeightRange(
  eventType: string,
  startHeight: number,
  endHeight: number
): InteractionBuilderFn {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventType
      ix.events.start = startHeight
      ix.events.end = endHeight
      return Ok(ix)
    },
  ])
}
