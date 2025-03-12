import {SdkTransport} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"

type BlocksArgs =
  SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.BLOCKS>

type BlocksData =
  SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCKS>

type BlocksDataDto = {
  payload: {
    header: {
      id: string
      parent_id: string
      height: number
      timestamp: string
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
}

type BlocksArgsDto = {block_status: "finalized" | "sealed"} & (
  | {
      start_block_id?: string
    }
  | {
      start_block_height?: string
    }
)

export const blocksHandler = createSubscriptionHandler<{
  Topic: SdkTransport.SubscriptionTopic.BLOCKS
  Args: BlocksArgs
  Data: BlocksData
  ArgsDto: BlocksArgsDto
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
            id: data.payload.header.id,
            parentId: data.payload.header.parent_id,
            height: data.payload.header.height,
            timestamp: data.payload.header.timestamp,
            collectionGuarantees:
              data.payload.payload.collection_guarantees.map(guarantee => ({
                collectionId: guarantee.collection_id,
                signerIds: guarantee.signer_indices,
              })),
            blockSeals: data.payload.payload.block_seals.map(seal => ({
              blockId: seal.block_id,
              executionReceiptId: seal.result_id,
            })),
          },
        }

        // Update the resume args
        resumeArgs = {
          blockStatus: resumeArgs.blockStatus,
          startBlockHeight: data.payload.header.height + 1,
        }

        onData(parsedData)
      },
      onError(error: Error) {
        onError(error)
      },
      argsToDto(args: BlocksArgs) {
        let encodedArgs: BlocksArgsDto = {
          block_status: args.blockStatus,
        }

        if ("startBlockHeight" in args) {
          return {
            ...encodedArgs,
            start_block_height: String(args.startBlockHeight),
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
        // TODO: FIX
        return this.argsToDto(resumeArgs) as any
      },
    }
  },
})
