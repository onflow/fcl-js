import {SdkTransport} from "@onflow/typedefs"
import {BlockArgsDto, createSubscriptionHandler} from "./types"

type BlockHeadersArgs =
  SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.BLOCK_HEADERS>

type BlockHeadersData =
  SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCK_HEADERS>

type BlockHeadersArgsDto = BlockArgsDto

type BlockHeadersDataDto = {
  id: string
  parent_id: string
  height: string
  timestamp: string
  parent_voter_signature: string // TODO: Unused
}

export const blockHeadersHandler = createSubscriptionHandler<{
  Topic: SdkTransport.SubscriptionTopic.BLOCK_HEADERS
  Args: BlockHeadersArgs
  Data: BlockHeadersData
  ArgsDto: BlockHeadersArgsDto
  DataDto: BlockHeadersDataDto
}>({
  topic: SdkTransport.SubscriptionTopic.BLOCK_HEADERS,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: BlockHeadersArgs = {
      ...initialArgs,
    }

    return {
      onData(data: BlockHeadersDataDto) {
        // Parse the raw data
        const parsedData: BlockHeadersData = {
          // TODO: We do not know the data model types yet
          blockHeader: {
            id: data.id,
            parentId: data.parent_id,
            height: Number(data.height),
            timestamp: data.timestamp,
            parentVoterSignature: data.parent_voter_signature,
          } as any,
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
