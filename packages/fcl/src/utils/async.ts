const AbortController =
  globalThis.AbortController || require("abort-controller")

// Dynamic implementation of Promise.race that allows adding new promises after creation
export function dynamicRace() {
  let resolve: (value: any) => void, reject: (reason: any) => void
  let result = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  function addCandidate(promise: Promise<any>) {
    promise.then(resolve, reject)
  }

  return {addCandidate, result}
}

export function wrapAbortSignal(signal?: AbortSignal) {
  const controller = new AbortController()
  if (signal?.aborted) controller.abort()
  signal?.addEventListener("abort", () => controller.abort())
  return controller
}
