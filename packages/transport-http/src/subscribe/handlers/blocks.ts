import {SdkTransport} from "@onflow/typedefs"
import {createSubscriptionHandler} from "./types"

export const blocksHandler = createSubscriptionHandler<{
  Topic: SdkTransport.SubscriptionTopic.BLOCKS
  Args: SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.BLOCKS>
  Data: SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCKS>
  RawData: {
    data: SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCKS>
  }
}>({
  topic: SdkTransport.SubscriptionTopic.BLOCKS,
  createSubscriber: (initialArgs, onData, onError) => {
    let resumeArgs: SdkTransport.SubscriptionArguments<SdkTransport.SubscriptionTopic.BLOCKS> =
      initialArgs

    return {
      sendData(data: {
        data: SdkTransport.SubscriptionData<SdkTransport.SubscriptionTopic.BLOCKS>
      }) {
        const parsedData = data.data

        resumeArgs = {
          start: parsedData.placeholder.length,
        }

        onData(data.data)
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
