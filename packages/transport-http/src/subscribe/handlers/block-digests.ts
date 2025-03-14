import {SdkTransport} from "@onflow/typedefs"
import {BlockArgsDto, createSubscriptionHandler} from "./types"

type BlockDigestsArgs =
  SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.BLOCK_DIGESTS>

type BlockDigestsData =
  SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCK_DIGESTS>

type BlockDigestsDataDto = {
  block_id: string
  height: string
  timestamp: string
}

type BlockDigestsArgsDto = BlockArgsDto

export const blockDigestsHandler = createSubscriptionHandler<{
  Topic: SdkTransport.SubscriptionTopic.BLOCK_DIGESTS
  Args: BlockDigestsArgs
  Data: BlockDigestsData
  ArgsDto: BlockDigestsArgsDto
  DataDto: BlockDigestsDataDto
}>({
  topic: SdkTransport.SubscriptionTopic.BLOCK_DIGESTS,
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
      argsToDto(args: BlockDigestsArgs) {
        let encodedArgs: BlockDigestsArgsDto = {
          block_status: args.blockStatus,
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
        // TODO: this is not good
        return this.argsToDto(resumeArgs) as any
      },
    }
  },
})
