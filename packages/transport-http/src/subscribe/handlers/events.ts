import {
  SubscriptionTopic,
  SubscriptionArgs,
  RawSubscriptionData,
} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"

type EventsArgs = SubscriptionArgs<SubscriptionTopic.EVENTS>

type EventsData = RawSubscriptionData<SubscriptionTopic.EVENTS>

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
  Topic: SubscriptionTopic.EVENTS
  Args: EventsArgs
  Data: EventsData
  ArgsDto: EventsArgsDto
  DataDto: EventsDataDto
}>({
  topic: SubscriptionTopic.EVENTS,
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
              payload: JSON.parse(
                Buffer.from(event.payload, "base64").toString()
              ),
            },
          }

          onData(result)
        }

        // Update the resume args
        resumeArgs = {
          ...resumeArgs,
          startHeight: Number(BigInt(rawData.block_height) + BigInt(1)),
          startBlockId: undefined,
        }
      },
      onError(error: Error) {
        onError(error)
      },
      getConnectionArgs() {
        let encodedArgs: EventsArgsDto = {
          event_types: resumeArgs.eventTypes,
          addresses: resumeArgs.addresses,
          contracts: resumeArgs.contracts,
        }

        if ("startBlockHeight" in resumeArgs && resumeArgs.startBlockHeight) {
          return {
            ...encodedArgs,
            start_block_height: resumeArgs.startBlockHeight,
          }
        }

        if ("startBlockId" in resumeArgs && resumeArgs.startBlockId) {
          return {
            ...encodedArgs,
            start_block_id: resumeArgs.startBlockId,
          }
        }

        return encodedArgs
      },
    }
  },
})
