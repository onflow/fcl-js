import {
  RawSubscriptionData,
  SubscriptionArgs,
  SubscriptionData,
  SubscriptionTopic,
} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"

type AccountStatusesArgs = SubscriptionArgs<SubscriptionTopic.ACCOUNT_STATUSES>

type AccountStatusesData =
  RawSubscriptionData<SubscriptionTopic.ACCOUNT_STATUSES>

type AccountStatusesArgsDto = {
  start_block_id?: string
  start_block_height?: number
  event_types?: string[]
  addresses?: string[]
  account_addresses?: string[]
}

type AccountStatusesDataDto = {
  block_id: string
  height: string
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
  Topic: SubscriptionTopic.ACCOUNT_STATUSES
  Args: AccountStatusesArgs
  Data: AccountStatusesData
  ArgsDto: AccountStatusesArgsDto
  DataDto: AccountStatusesDataDto
}>({
  topic: SubscriptionTopic.ACCOUNT_STATUSES,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: AccountStatusesArgs = {
      ...initialArgs,
    }

    return {
      onData(rawData: AccountStatusesDataDto) {
        const data: AccountStatusesData[] = []
        for (const [address, events] of Object.entries(
          rawData.account_events
        )) {
          for (const event of events) {
            // Parse the raw data
            const parsedData: AccountStatusesData = {
              accountStatusEvent: {
                accountAddress: address,
                blockId: rawData.block_id,
                blockHeight: Number(rawData.height),
                type: event.type,
                transactionId: event.transaction_id,
                transactionIndex: Number(event.transaction_index),
                eventIndex: Number(event.event_index),
                payload: event.payload,
              },
            }

            data.push(parsedData)
          }

          // Sort the messages by increasing message index
          data.sort((a, b) => {
            const txIndexDiff =
              a.accountStatusEvent.transactionIndex -
              b.accountStatusEvent.transactionIndex
            if (txIndexDiff !== 0) return txIndexDiff

            return (
              a.accountStatusEvent.eventIndex - b.accountStatusEvent.eventIndex
            )
          })

          // Emit the messages
          for (const message of data) {
            onData(message)
          }

          // Update the resume args
          resumeArgs = {
            ...resumeArgs,
            startBlockHeight: Number(BigInt(rawData.height) + BigInt(1)),
            startBlockId: undefined,
          }
        }
      },
      onError(error: Error) {
        onError(error)
      },
      getConnectionArgs() {
        let encodedArgs: AccountStatusesArgsDto = {
          event_types: resumeArgs.eventTypes,
          addresses: resumeArgs.addresses,
          account_addresses: resumeArgs.accountAddresses,
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
