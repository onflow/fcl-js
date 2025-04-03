import {
  SubscriptionTopic,
  SubscriptionArgs,
  RawSubscriptionData,
} from "@onflow/typedefs"
import {BlockArgsDto, createSubscriptionHandler} from "./types"

type BlockDigestsArgs = SubscriptionArgs<SubscriptionTopic.BLOCK_DIGESTS>

type BlockDigestsData = RawSubscriptionData<SubscriptionTopic.BLOCK_DIGESTS>

type BlockDigestsDataDto = {
  block_id: string
  height: string
  timestamp: string
}

type BlockDigestsArgsDto = BlockArgsDto

export const blockDigestsHandler = createSubscriptionHandler<{
  Topic: SubscriptionTopic.BLOCK_DIGESTS
  Args: BlockDigestsArgs
  Data: BlockDigestsData
  ArgsDto: BlockDigestsArgsDto
  DataDto: BlockDigestsDataDto
}>({
  topic: SubscriptionTopic.BLOCK_DIGESTS,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: BlockDigestsArgs = {
      ...initialArgs,
    }

    return {
      onData(data: BlockDigestsDataDto) {
        // Parse the raw data
        const parsedData: BlockDigestsData = {
          blockDigest: {
            id: data.block_id,
            height: Number(data.height),
            timestamp: data.timestamp,
          },
        }

        // Update the resume args
        resumeArgs = {
          blockStatus: resumeArgs.blockStatus,
          startBlockId: String(BigInt(data.height) + BigInt(1)),
        }

        onData(parsedData)
      },
      onError(error: Error) {
        onError(error)
      },
      getConnectionArgs() {
        let encodedArgs: BlockDigestsArgsDto = {
          block_status: resumeArgs.blockStatus,
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
