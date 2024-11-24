import {invariant} from "@onflow/sdk"

/**
 * @description Get Interaction Template argument message
 *
 * @param {object} params
 * @param {string} params.localization [localization="en-US"] - Localization code
 * @param {string} params.messageKey - Message key
 * @param {object} params.template - Interaction Template
 * @returns {string} - Message
 */
export function getTemplateMessage({
  localization = "en-US",
  messageKey,
  template,
}) {
  invariant(
    messageKey,
    "getTemplateMessage({ messageKey }) -- messageKey must be defined"
  )
  invariant(
    typeof messageKey === "string",
    "getTemplateMessage({ messageKey }) -- messageKey must be a string"
  )

  invariant(
    localization,
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
    typeof template.f_type === "InteractionTemplate",
    "getTemplateMessage({ template }) -- template object must be an InteractionTemplate"
  )

  switch (template.f_version) {
    case "1.1.0":
      const msg = template?.data?.messages?.find(a => a.key === messageKey)
      if (!msg) return undefined
      const lzn = msg?.i18n?.find(a => a.tag === localization)
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
