import {SdkTransport} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"

type AccountStatusesArgs =
  SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES>

type AccountStatusesData =
  SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.ACCOUNT_STATUSES>

type AccountStatusesArgsDto = {
  start_block_id?: string
  start_block_height?: number
  event_types?: string[]
  addresses?: string[]
  account_addresses?: string[]
}

type AccountStatusesDataDto = {
  block_id: string
  block_height: string
  block_timestamp: string
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
      onData(rawData: AccountStatusesDataDto) {
        const data: AccountStatusesData[] = []
        for (const [address, events] of Object.entries(
          rawData.account_events
        )) {
          for (const event of events) {
            // Parse the raw data
            const parsedData: AccountStatusesData = {
              accountStatus: {
                accountAddress: address,
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
              startBlockHeight: Number(
                BigInt(rawData.block_height) + BigInt(1)
              ),
              startBlockId: undefined,
            }

            data.push(parsedData)
          }

          // Sort the messages by increasing message index
          data.sort((a, b) => {
            return (
              a.accountStatus.transactionIndex -
              b.accountStatus.transactionIndex
            )
          })

          // Emit the messages
          for (const message of data) {
            onData(message)
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

        if ("startBlockHeight" in resumeArgs) {
          return {
            ...encodedArgs,
            start_block_height: resumeArgs.startBlockHeight,
          }
        }

        if ("startBlockId" in resumeArgs) {
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
