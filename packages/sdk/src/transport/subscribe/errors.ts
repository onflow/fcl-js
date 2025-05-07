export class SubscriptionsNotSupportedError extends Error {
  constructor() {
    super(
      `The current transport does not support subscriptions.  If you have provided a custom transport (e.g. via \`sdk.transport\` configuration), ensure that it implements the subscribe method.`
    )
    this.name = "SubscriptionsNotSupportedError"
  }
}
