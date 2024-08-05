export const isServer = typeof window === "undefined"

// Dynamic implementation of Promise.race that allows adding new promises after creation
export function dynamicRace(abortController?: AbortController) {
  let resolve: (value: any) => void, reject: (reason: any) => void
  let result = new Promise((resolve, reject) => {
    resolve = resolve
    reject = reject
  }).finally(() => {
    abortController?.abort()
  })

  function addCandidate(promise: Promise<any>) {
    promise.then(resolve, reject)
  }

  return {addCandidate, result}
}

// Abortable promise that resolves after a timeout
export function createTimeoutPromise(timeout: number) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject("Timeout")
    }, timeout)
  })
}

export function wrapAbortSignal(signal?: AbortSignal) {
  const controller = new AbortController()
  if (signal?.aborted) controller.abort()
  signal?.addEventListener("abort", () => controller.abort())
  return controller
}
