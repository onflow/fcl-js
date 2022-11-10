import {invariant} from "@onflow/sdk"

export function getTemplateArgumentMessage({
  localization = "en-US",
  argumentLabel,
  messageKey,
  template,
}) {
  invariant(
    messageKey,
    "getMessage({ messageKey }) -- messageKey must be defined"
  )
  invariant(
    typeof messageKey === "string",
    "getMessage({ messageKey }) -- messageKey must be a string"
  )

  invariant(
    argumentLabel,
    "getMessage({ argumentLabel }) -- argumentLabel must be defined"
  )
  invariant(
    typeof messageKey === "string",
    "getMessage({ argumentLabel }) -- argumentLabel must be a string"
  )

  invariant(
    localization,
    "getMessage({ localization }) -- localization must be defined"
  )
  invariant(
    typeof localization === "string",
    "getMessage({ localization }) -- localization must be a string"
  )

  invariant(
    template != undefined,
    "generateTemplateId({ template }) -- template must be defined"
  )
  invariant(
    typeof template === "object",
    "generateTemplateId({ template }) -- template must be an object"
  )
  invariant(
    template.f_type === "InteractionTemplate",
    "generateTemplateId({ template }) -- template object must be an InteractionTemplate"
  )

  const args = template?.data?.arguments

  return args?.[argumentLabel]?.messages?.[messageKey]?.i18n?.[localization]
}
