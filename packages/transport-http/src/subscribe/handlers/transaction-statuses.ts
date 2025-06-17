import {
  RawSubscriptionData,
  SubscriptionArgs,
  SubscriptionTopic,
  TransactionExecutionStatus,
} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"
import {Buffer} from "buffer"

type TransactionStatusesArgs = SubscriptionArgs<
  typeof SubscriptionTopic.TRANSACTION_STATUSES
>

type TransactionStatusesData = RawSubscriptionData<
  typeof SubscriptionTopic.TRANSACTION_STATUSES
>

type TransactionStatusesArgsDto = {
  tx_id: string
}

type TransactionStatusesDataDto = {
  transaction_result: {
    block_id: string
    collection_id: string
    execution: string
    status: string
    status_code: 0 | 1
    error_message: string
    computation_used: string
    events: {
      type: string
      transaction_id: string
      transaction_index: string
      event_index: string
      payload: string
    }[]
  }
}

export const transactionStatusesHandler = createSubscriptionHandler<{
  Topic: typeof SubscriptionTopic.TRANSACTION_STATUSES
  Args: TransactionStatusesArgs
  Data: TransactionStatusesData
  ArgsDto: TransactionStatusesArgsDto
  DataDto: TransactionStatusesDataDto
}>({
  topic: SubscriptionTopic.TRANSACTION_STATUSES,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: TransactionStatusesArgs = {
      ...initialArgs,
    }

    return {
      onData(data: TransactionStatusesDataDto) {
        // Parse the raw data
        const parsedData: TransactionStatusesData = {
          transactionStatus: {
            blockId: data.transaction_result.block_id,
            status:
              TransactionExecutionStatus[
                data.transaction_result.status.toUpperCase() as keyof typeof TransactionExecutionStatus
              ],
            statusString: data.transaction_result.status.toUpperCase(),
            statusCode: data.transaction_result.status_code,
            errorMessage: data.transaction_result.error_message,
            events: data.transaction_result.events.map(event => ({
              type: event.type,
              transactionId: event.transaction_id,
              transactionIndex: Number(event.transaction_index),
              eventIndex: Number(event.event_index),
              payload: JSON.parse(
                Buffer.from(event.payload, "base64").toString()
              ),
            })),
          },
        }

        onData(parsedData)
      },
      onError(error: Error) {
        onError(error)
      },
      getConnectionArgs() {
        return {
          tx_id: resumeArgs.transactionId,
        }
      },
    }
  },
})
