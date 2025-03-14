import {SdkTransport} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"
import {EventsArgsDto} from "./events"

type AccountStatusesArgs =
  SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES>

type AccountStatusesData =
  SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES>

type AccountStatusesArgsDto = EventsArgsDto

type AccountStatusesDataDto = {
  block_id: string
  block_height: string
  // block_timestamp: string
  account_events: {
    [address: string]: {
      type: string
      transaction_id: string
      transaction_index: string
      event_index: string
      payload: string
    }[]
  }
  message_index: string
}

export const accountStatusesHandler = createSubscriptionHandler<{
  Topic: SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES
  Args: SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES>
  Data: SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES>
  ArgsDto: AccountStatusesArgsDto
  DataDto: AccountStatusesDataDto
}>({
  topic: SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: AccountStatusesArgs = {
      ...initialArgs,
    }

    return {
      onData(data: AccountStatusesDataDto) {
        for (const [address, events] of Object.entries(data.account_events)) {
          for (const event of events) {
            // Parse the raw data
            const parsedData: AccountStatusesData = {
              accountStatus: {
                accountAddress: address,
                blockId: data.block_id,
                blockHeight: Number(data.block_height),
                blockTimestamp: "", // TODO
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
              startBlockHeight: Number(BigInt(data.block_height) + BigInt(1)),
              startBlockId: undefined,
            }

            onData(parsedData)
          }
        }
      },
      onError(error: Error) {
        onError(error)
      },
      argsToDto(args: AccountStatusesArgs) {
        let encodedArgs: AccountStatusesArgsDto = {
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
