import {
  pipe,
  Ok,
  makeGetEvents,
  InteractionBuilderFn,
} from "../interaction/interaction"

/**
 * A builder function that returns all instances of a particular event (by name) within a set of blocks, specified by block ids.
 *
 * The block range provided must be from the current spork.
 *
 * Event type is a string that follow a standard format: A.{AccountAddress}.{ContractName}.{EventName}
 *
 * Please read more about [events in the documentation](https://docs.onflow.org/cadence/language/events/).
 *
 * @param eventType The type of event to get
 * @param blockIds The ids of the blocks to scan for events
 * @returns A function that processes an interaction object
 *
 * @example
 * import * as fcl from "@onflow/fcl";
 *
 * const events = await fcl.send([
 *   fcl.getEventsAtBlockIds("A.7e60df042a9c0868.FlowToken.TokensWithdrawn", [
 *     "c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7",
 *     "5dbaa85922eb194a3dc463c946cc01c866f2ff2b88f3e59e21c0d8d00113273f"
 *   ])
 * ]).then(fcl.decode);
 */
export function getEventsAtBlockIds(
  eventType: string,
  blockIds: string[]
): InteractionBuilderFn {
  return pipe([
    makeGetEvents,
    ix => {
      ix.events.eventType = eventType
      ix.events.blockIds = blockIds
      return Ok(ix)
    },
  ])
}
