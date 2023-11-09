import {interaction} from "../interaction/interaction.js"
import {subscription} from "./build-subscription.js"

describe("Build Subscription", () => {
  test("build subscription", async () => {
    const onData = () => {}
    const onError = () => {}
    const onComplete = () => {}

    let ix = await subscription({
      onData,
      onError,
      onComplete,
    })(interaction())

    expect(ix.subscription.onData).toBe(onData)
    expect(ix.subscription.onError).toBe(onError)
    expect(ix.subscription.onComplete).toBe(onComplete)
  })
})
