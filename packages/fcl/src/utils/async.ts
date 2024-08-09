const AbortController =
  globalThis.AbortController || require("abort-controller")

export function wrapAbortSignal(signal?: AbortSignal) {
  const controller = new AbortController()
  if (signal?.aborted) controller.abort()
  signal?.addEventListener("abort", () => controller.abort())
  return controller
}
