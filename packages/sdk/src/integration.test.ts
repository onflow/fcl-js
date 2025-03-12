import {SdkTransport} from "@onflow/typedefs"
import {subscribe} from "./sdk"

jest.setTimeout(30000)

test("test streaming", async () => {
  const test = await subscribe(
    {
      topic: SdkTransport.SubscriptionTopic.BLOCKS,
      args: {blockStatus: "sealed"},
      onData: data => {
        console.log(data)
      },
      onError: error => {
        console.error(error)
      },
    },
    {
      node: "ws://92.253.238.247/v1/ws",
    }
  )

  await new Promise(resolve => setTimeout(resolve, 10000))

  test.unsubscribe()

  console.log("unsubscribed")

  await new Promise(resolve => setTimeout(resolve, 10000))
})
