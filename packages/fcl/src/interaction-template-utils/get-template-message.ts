import {invariant} from "@onflow/sdk"

export function getTemplateMessage({
  localization = "en-US",
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

  const messages = template?.data?.messages

  return messages?.[messageKey]?.i18n?.[localization]
}
