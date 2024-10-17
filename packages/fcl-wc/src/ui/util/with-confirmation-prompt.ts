import {getConfirmationPrompt} from "../ConfirmationPrompt"

export const withConfirmationPrompt = async <T>(
  callback: (signal: AbortSignal) => Promise<T> | T
) => {
  const modal = getConfirmationPrompt()
  modal.open = true

  const abortController = new AbortController()
  modal.addEventListener("close", () => {
    abortController.abort("User aborted operation")
  })

  const result = await callback(abortController.signal)

  modal.open = false
  abortController.abort()

  return result
}
