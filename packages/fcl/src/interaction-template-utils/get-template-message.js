import {invariant} from "@onflow/sdk"

/**
 * @description Get Interaction Template argument message
 * 
 * @param {Object} params
 * @param {string} params.localization [localization="en-US"] - Localization code
 * @param {string} params.messageKey - Message key
 * @param {Object} params.template - Interaction Template
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

  const messages = template?.data?.messages

  return messages?.[messageKey]?.i18n?.[localization]
}
