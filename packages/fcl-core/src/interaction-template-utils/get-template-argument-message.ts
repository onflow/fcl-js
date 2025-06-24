import {invariant} from "@onflow/sdk"
import type {InteractionTemplate} from "./interaction-template"

export interface GetTemplateArgumentMessageParams {
  localization?: string
  argumentLabel: string
  messageKey: string
  template: InteractionTemplate
}

/**
 * @description Gets Interaction Template argument message by message key, argument label, and localization
 *
 * @param params
 * @param params.localization [localization="en-US"] Localization to get message for
 * @param params.argumentLabel Argument label to get message for
 * @param params.messageKey Message key to get message for
 * @param params.template Interaction Template to get message from
 * @returns Message
 */
export function getTemplateArgumentMessage({
  localization = "en-US",
  argumentLabel,
  messageKey,
  template,
}: GetTemplateArgumentMessageParams): string | undefined {
  invariant(
    messageKey,
    "getTemplateArgumentMessage({ messageKey }) -- messageKey must be defined"
  )
  invariant(
    typeof messageKey === "string",
    "getTemplateArgumentMessage({ messageKey }) -- messageKey must be a string"
  )

  invariant(
    argumentLabel,
    "getTemplateArgumentMessage({ argumentLabel }) -- argumentLabel must be defined"
  )
  invariant(
    typeof argumentLabel === "string",
    "getTemplateArgumentMessage({ argumentLabel }) -- argumentLabel must be a string"
  )

  invariant(
    localization,
    "getTemplateArgumentMessage({ localization }) -- localization must be defined"
  )
  invariant(
    typeof localization === "string",
    "getTemplateArgumentMessage({ localization }) -- localization must be a string"
  )

  invariant(
    template != undefined,
    "getTemplateArgumentMessage({ template }) -- template must be defined"
  )
  invariant(
    typeof template === "object",
    "getTemplateArgumentMessage({ template }) -- template must be an object"
  )
  invariant(
    template.f_type === "InteractionTemplate",
    "getTemplateArgumentMessage({ template }) -- template object must be an InteractionTemplate"
  )

  switch (template.f_version) {
    case "1.1.0":
      const param = template?.data?.parameters?.find(
        (a: any) => a.label === argumentLabel
      )
      if (!param) return undefined
      const message = param?.messages?.find((a: any) => a.key === messageKey)
      if (!message) return undefined
      const lzn = message?.i18n?.find((a: any) => a.tag === localization)
      if (!lzn) return undefined
      return lzn.translation
    case "1.0.0":
      return template?.data?.arguments?.[argumentLabel]?.messages?.[messageKey]
        ?.i18n?.[localization]
    default:
      throw new Error(
        "getTemplateArgumentMessage Error: Unsupported template version"
      )
  }
}
