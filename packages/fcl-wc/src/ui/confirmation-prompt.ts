import {config} from "@onflow/config"
import {AdaptiveModal} from "./components/AdaptiveModal"
import {ConfirmationPrompt} from "./components/ConfirmationPrompt"
import {LoadingDots} from "./components/LoadingDots"
import {createElement, defineElement} from "./util/create-element"

let confirmationPrompt: ConfirmationPrompt | null = null

export function getConfirmationPrompt() {
  defineElement(AdaptiveModal)
  defineElement(LoadingDots)

  if (confirmationPrompt == null) {
    confirmationPrompt = createElement(ConfirmationPrompt, new Map())
    document.body.appendChild(confirmationPrompt)
  }
  return confirmationPrompt
}

export const withConfirmationPrompt = async <T>(
  user: any,
  callback: (signal: AbortSignal) => Promise<T> | T
) => {
  const provider = user?.services?.find(
    (s: any) => s.type === "authn"
  )?.provider

  const modal = getConfirmationPrompt()
  modal.open = true
  modal.provider = provider
  await config()
    .get<string | null>("app.detail.icon")
    .then((icon: string | null) => {
      modal.initiatorIcon = icon
    })

  const abortController = new AbortController()
  modal.addEventListener("close", () => {
    abortController.abort("User aborted operation")
  })

  const result = await callback(abortController.signal)

  modal.open = false
  abortController.abort()

  return result
}
