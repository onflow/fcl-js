import {SdkTransport} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"

type EventsArgs =
  SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.EVENTS>

type EventsData =
  SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.EVENTS>

export type EventsArgsDto = (
  | {
      start_block_id: string
    }
  | {
      start_block_height: number
    }
  | {}
) & {
  event_types?: string[]
  addresses?: string[]
  contracts?: string[]
}

type EventsDataDto = {
  block_id: string
  block_height: string
  block_timestamp: string
  events: {
    type: string
    transaction_id: string
    transaction_index: string
    event_index: string
    payload: string
  }[]
}

export const eventsHandler = createSubscriptionHandler<{
  Topic: SdkTransport.SubscriptionTopic.EVENTS
  Args: EventsArgs
  Data: EventsData
  ArgsDto: EventsArgsDto
  DataDto: EventsDataDto
}>({
  topic: SdkTransport.SubscriptionTopic.EVENTS,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: EventsArgs = {
      ...initialArgs,
    }

    return {
      onData(rawData: EventsDataDto) {
        for (const event of rawData.events) {
          // Parse the raw data
          const result: EventsData = {
            event: {
              blockId: rawData.block_id,
              blockHeight: Number(rawData.block_height),
              blockTimestamp: rawData.block_timestamp,
              type: event.type,
              transactionId: event.transaction_id,
              transactionIndex: Number(event.transaction_index),
              eventIndex: Number(event.event_index),
              payload: event.payload,
            },
          }

          // Update the resume args
          resumeArgs = {
            ...resumeArgs,
            startBlockHeight: result.event.blockHeight + 1,
            startBlockId: undefined,
          }

          onData(result)
        }
      },
      onError(error: Error) {
        onError(error)
      },
      argsToDto(args: EventsArgs) {
        let encodedArgs: EventsArgsDto = {
          event_types: args.filter?.eventTypes,
          addresses: args.filter?.addresses,
          contracts: args.filter?.contracts,
        }

        if ("startBlockHeight" in args) {
          return {
            ...encodedArgs,
            start_block_height: args.startBlockHeight,
          }
        }

        if ("startBlockId" in args) {
          return {
            ...encodedArgs,
            start_block_id: args.startBlockId,
          }
        }

        return encodedArgs
      },
      get connectionArgs() {
        return resumeArgs
      },
    }
  },
})
