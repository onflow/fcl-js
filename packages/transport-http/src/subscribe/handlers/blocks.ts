import {SdkTransport} from "@onflow/typedefs"
import {createSubscriptionHandler, BlockArgsDto} from "./types"

type BlocksArgs =
  SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.BLOCKS>

type BlocksData =
  SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCKS>

type BlocksDataDto = {
  header: {
    id: string
    parent_id: string
    height: string
    timestamp: string
    parent_voter_signature: string
  }
  payload: {
    collection_guarantees: {
      collection_id: string
      signer_indices: string[]
    }[]
    block_seals: {
      block_id: string
      result_id: string
    }[]
  }
}

export const blocksHandler = createSubscriptionHandler<{
  Topic: SdkTransport.SubscriptionTopic.BLOCKS
  Args: BlocksArgs
  Data: BlocksData
  ArgsDto: BlockArgsDto
  DataDto: BlocksDataDto
}>({
  topic: SdkTransport.SubscriptionTopic.BLOCKS,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: BlocksArgs = {
      ...initialArgs,
    }

    return {
      onData(data: BlocksDataDto) {
        // Parse the raw data
        const parsedData: BlocksData = {
          block: {
            id: data.header.id,
            parentId: data.header.parent_id,
            height: Number(data.header.height),
            timestamp: data.header.timestamp,
            parentVoterSignature: data.header.parent_voter_signature,
            collectionGuarantees: data.payload.collection_guarantees.map(
              guarantee => ({
                collectionId: guarantee.collection_id,
                signerIds: guarantee.signer_indices,
              })
            ),
            blockSeals: data.payload.block_seals.map(seal => ({
              blockId: seal.block_id,
              executionReceiptId: seal.result_id,
            })),
          },
        }

        // Update the resume args
        resumeArgs = {
          blockStatus: resumeArgs.blockStatus,
          startBlockHeight: Number(BigInt(data.header.height) + BigInt(1)),
        }

        onData(parsedData)
      },
      onError(error: Error) {
        onError(error)
      },
      getConnectionArgs() {
        let encodedArgs: BlockArgsDto = {
          block_status: resumeArgs.blockStatus,
        }

        if ("startBlockHeight" in resumeArgs) {
          return {
            ...encodedArgs,
            start_block_height: String(resumeArgs.startBlockHeight),
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
