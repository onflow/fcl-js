import {invariant} from "@onflow/sdk"

/**
 * @description Gets Interaction Template argument message by message key, argument label, and localization
 *
 * @param {object} opts
 * @param {string} opts.localization [localization="en-US"] - Localization to get message for
 * @param {string} opts.argumentLabel - Argument label to get message for
 * @param {string} opts.messageKey - Message key to get message for
 * @param {object} opts.template - Interaction Template to get message from
 * @returns {string} - Message
 */
export function getTemplateArgumentMessage({
  localization = "en-US",
  argumentLabel,
  messageKey,
  template,
}) {
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
    typeof messageKey === "string",
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
    typeof template.f_type === "InteractionTemplate",
    "getTemplateArgumentMessage({ template }) -- template object must be an InteractionTemplate"
  )

  switch (template.f_version) {
    case "1.1.0":
      const param = template?.data?.parameters?.find(
        a => a.label === argumentLabel
      )
      if (!param) return undefined
      const message = param?.messages?.find(a => a.key === messageKey)
      if (!message) return undefined
      const lzn = message?.i18n?.find(a => a.tag === localization)
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
