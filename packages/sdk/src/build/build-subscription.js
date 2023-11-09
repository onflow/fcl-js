export function subscription({onData, onError, onComplete}) {
  return ix => {
    ix.subscription.onData = onData
    ix.subscription.onError = onError
    ix.subscription.onComplete = onComplete
    return ix
  }
}
