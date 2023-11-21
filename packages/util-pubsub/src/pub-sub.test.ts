import {PubSub} from "./pub-sub"

function flushEvents() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

describe("util-pubsub", () => {
  it("should publish messages asynchronously", async () => {
    const pubsub = new PubSub<string>()
    const messages: string[] = []
    const subscription = pubsub.subscribe(message => messages.push(message))
    pubsub.next("foo")
    pubsub.next("bar")
    subscription.unsubscribe()
    pubsub.next("baz")

    await flushEvents()
    expect(messages).toEqual(["foo", "bar"])
  })

  it("should publish messages synchronously", () => {
    const pubsub = new PubSub<string>()
    const messages: string[] = []
    const subscription = pubsub.subscribe(message => messages.push(message))
    pubsub.next("foo", true)
    pubsub.next("bar", true)
    subscription.unsubscribe()
    pubsub.next("baz", true)
    expect(messages).toEqual(["foo", "bar"])
  })

  it("should publish errors", async () => {
    const pubsub = new PubSub<string>()
    const errors: any[] = []
    const subscription = pubsub.subscribe(undefined, error =>
      errors.push(error)
    )
    pubsub.error("foo")
    pubsub.error("bar")
    subscription.unsubscribe()
    pubsub.error("baz")

    await flushEvents()
    expect(errors).toEqual(["foo", "bar"])
  })

  it("should publish errors synchronously", () => {
    const pubsub = new PubSub<string>()
    const errors: any[] = []
    const subscription = pubsub.subscribe(undefined, error =>
      errors.push(error)
    )
    pubsub.error("foo", true)
    pubsub.error("bar", true)
    subscription.unsubscribe()
    pubsub.error("baz", true)

    expect(errors).toEqual(["foo", "bar"])
  })

  it("should publish completion", async () => {
    const pubsub = new PubSub<string>()
    const completions: any[] = []
    const subscription = pubsub.subscribe(undefined, undefined, () =>
      completions.push(true)
    )
    jest.spyOn(subscription, "unsubscribe")
    pubsub.complete(true)

    await flushEvents()

    expect(completions).toEqual([true, true])
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
  })

  it("should publish completion synchronously", () => {
    const pubsub = new PubSub<string>()
    const completions: any[] = []
    const subscription = pubsub.subscribe(undefined, undefined, () =>
      completions.push(true)
    )
    jest.spyOn(subscription, "unsubscribe")
    pubsub.complete(true)

    expect(completions).toEqual([true, true])
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
  })
})
