import {invariant} from "@onflow/util-invariant"
import type {InteractionTemplate} from "./interaction-template"

export interface GetTemplateMessageParams {
  localization?: string
  messageKey: string
  template: InteractionTemplate
}

/**
 * @description Get Interaction Template argument message
 *
 * @param params
 * @param params.localization [localization="en-US"] Localization code
 * @param params.messageKey Message key
 * @param params.template Interaction Template
 * @returns Message
 */
export function getTemplateMessage({
  localization = "en-US",
  messageKey,
  template,
}: GetTemplateMessageParams): string | undefined {
  invariant(
    messageKey as any,
    "getTemplateMessage({ messageKey }) -- messageKey must be defined"
  )
  invariant(
    typeof messageKey === "string",
    "getTemplateMessage({ messageKey }) -- messageKey must be a string"
  )

  invariant(
    localization as any,
    "getTemplateMessage({ localization }) -- localization must be defined"
  )
  invariant(
    typeof localization === "string",
    "getTemplateMessage({ localization }) -- localization must be a string"
  )

  invariant(
    template != undefined,
    "getTemplateMessage({ template }) -- template must be defined"
  )
  invariant(
    typeof template === "object",
    "getTemplateMessage({ template }) -- template must be an object"
  )
  invariant(
    template.f_type === "InteractionTemplate",
    "getTemplateMessage({ template }) -- template object must be an InteractionTemplate"
  )

  switch (template.f_version) {
    case "1.1.0":
      const msg = template?.data?.messages?.find(
        (a: any) => a.key === messageKey
      )
      if (!msg) return undefined
      const lzn = msg?.i18n?.find((a: any) => a.tag === localization)
      if (!lzn) return undefined
      return lzn.translation
    case "1.0.0":
      return template?.data?.messages?.[messageKey]?.i18n?.[localization]
    default:
      throw new Error(
        "getTemplateArgumentMessage Error: Unsupported template version"
      )
  }
}
