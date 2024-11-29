import {SdkTransport} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"

type BlockDataModel = {
  block: {
    id: string
    parent_id: string
    height: number
    timestamp: string
    collection_guarantees: {
      collection_id: string
      signer_ids: string[]
    }[]
    block_seals: {
      block_id: string
      result_id: string
    }[]
  }
}

export const blocksHandler = createSubscriptionHandler<{
  Topic: SdkTransport.SubscriptionTopic.BLOCKS
  Args: SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.BLOCKS>
  Data: SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCKS>
  RawData: BlockDataModel
}>({
  topic: SdkTransport.SubscriptionTopic.BLOCKS,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.BLOCKS> =
      {
        ...initialArgs,
      }

    return {
      sendData(data: BlockDataModel) {
        // Parse the raw data
        const parsedData: SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCKS> =
          {
            block: {
              id: data.block.id,
              parentId: data.block.parent_id,
              height: data.block.height,
              timestamp: data.block.timestamp,
              collectionGuarantees: data.block.collection_guarantees.map(
                guarantee => ({
                  collectionId: guarantee.collection_id,
                  signerIds: guarantee.signer_ids,
                })
              ),
              blockSeals: data.block.block_seals.map(seal => ({
                blockId: seal.block_id,
                executionReceiptId: seal.result_id,
              })),
            },
          }

        // Update the resume args
        resumeArgs = {
          block_status: resumeArgs.block_status,
          start_block_id: data.block.id,
        }

        onData(parsedData)
      },
      sendError(error: Error) {
        onError(error)
      },
      get connectionArgs() {
        return resumeArgs
      },
    }
  },
})
