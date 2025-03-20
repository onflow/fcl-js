import {SdkTransport} from "@onflow/typedefs"
import {subscribe} from "./sdk"
import {on} from "events"

jest.setTimeout(30000)

test("subscribe blocks", async () => {
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

  await new Promise(resolve => setTimeout(resolve, 5000))
})

test("subscribe block digests", async () => {
  const onData = jest.fn()
  const onError = jest.fn()

  const test = await subscribe(
    {
      topic: SdkTransport.SubscriptionTopic.BLOCK_DIGESTS,
      args: {blockStatus: "sealed"},
      onData,
      onError,
    },
    {
      node: "ws://92.253.238.247/v1/ws",
    }
  )

  await new Promise(resolve => setTimeout(resolve, 10000))

  // Check that we received data and that it is in the correct format
  onData.mock.calls.forEach(([data]) => {
    expect(data).toMatchObject({
      id: expect.any(String),
      height: expect.any(Number),
      timestamp: expect.any(String),
    })
  })
  expect(onError).not.toHaveBeenCalled()

  onData.mockClear()
  onError.mockClear()

  test.unsubscribe()

  await new Promise(resolve => setTimeout(resolve, 5000))

  expect(onData).not.toHaveBeenCalled()
  expect(onError).not.toHaveBeenCalled()
})

test("subscribe transaction", async () => {
  const onData = jest.fn()
  const onError = jest.fn()

  const test = await subscribe(
    {
      topic: SdkTransport.SubscriptionTopic.TRANSACTION_STATUSES,
      args: {
        transactionId:
          "4faf3bd8609a6d7104556b998b4688e6a446f520a47966daaaf542db9feee3c6",
      },
      onData,
      onError,
    },
    {
      node: "ws://92.253.238.247/v1/ws",
    }
  )

  await new Promise(resolve => setTimeout(resolve, 10000))

  // Check that we received data and that it is in the correct format
  onData.mock.calls.forEach(([data]) => {
    expect(data).toMatchObject({
      id: expect.any(String),
      height: expect.any(Number),
      timestamp: expect.any(String),
    })
  })
  expect(onError).not.toHaveBeenCalled()

  onData.mockClear()
  onError.mockClear()

  test.unsubscribe()

  await new Promise(resolve => setTimeout(resolve, 5000))

  expect(onData).not.toHaveBeenCalled()
  expect(onError).not.toHaveBeenCalled()
})
