import {
  SubscriptionArgs,
  RawSubscriptionData,
  SubscriptionTopic,
} from "@onflow/typedefs"
import {BlockArgsDto, createSubscriptionHandler} from "./types"

type BlockHeadersArgs = SubscriptionArgs<SubscriptionTopic.BLOCK_HEADERS>

type BlockHeadersData = RawSubscriptionData<SubscriptionTopic.BLOCK_HEADERS>

type BlockHeadersArgsDto = BlockArgsDto

type BlockHeadersDataDto = {
  id: string
  parent_id: string
  height: string
  timestamp: string
  parent_voter_signature: string
}

export const blockHeadersHandler = createSubscriptionHandler<{
  Topic: SubscriptionTopic.BLOCK_HEADERS
  Args: BlockHeadersArgs
  Data: BlockHeadersData
  ArgsDto: BlockHeadersArgsDto
  DataDto: BlockHeadersDataDto
}>({
  topic: SubscriptionTopic.BLOCK_HEADERS,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: BlockHeadersArgs = {
      ...initialArgs,
    }

    return {
      onData(data: BlockHeadersDataDto) {
        // Parse the raw data
        const parsedData: BlockHeadersData = {
          blockHeader: {
            id: data.id,
            parentId: data.parent_id,
            height: Number(data.height),
            timestamp: data.timestamp,
            parentVoterSignature: data.parent_voter_signature,
          },
        }

        // Update the resume args
        resumeArgs = {
          blockStatus: resumeArgs.blockStatus,
          startBlockHeight: Number(BigInt(data.height) + BigInt(1)),
        }

        onData(parsedData)
      },
      onError(error: Error) {
        onError(error)
      },
      getConnectionArgs() {
        let encodedArgs: BlockHeadersArgsDto = {
          block_status: resumeArgs.blockStatus,
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
