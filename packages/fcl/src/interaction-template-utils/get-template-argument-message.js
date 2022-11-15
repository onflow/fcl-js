import {invariant} from "@onflow/sdk"

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
