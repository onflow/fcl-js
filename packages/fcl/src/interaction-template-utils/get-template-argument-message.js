import {invariant} from "@onflow/sdk"

/**
 * @description Gets Interaction Template argument message by message key, argument label, and localization
 * 
 * @param {Object} opts
 * @param {string} opts.localization [localization="en-US"] - Localization to get message for
 * @param {string} opts.argumentLabel - Argument label to get message for
 * @param {string} opts.messageKey - Message key to get message for
 * @param {Object} opts.template - Interaction Template to get message from
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

  const args = template?.data?.arguments

  return args?.[argumentLabel]?.messages?.[messageKey]?.i18n?.[localization]
}
