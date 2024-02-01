import {invariant} from "@onflow/sdk"

export function normalize({templateInterface}) {
  invariant(
    templateInterface != undefined,
    "generateTemplateId({ iface }) -- iface must be defined"
  )
  invariant(
    typeof templateInterface === "object",
    "generateTemplateId({ iface }) -- iface must be an object"
  )
  invariant(
    templateInterface.f_type === "InteractionTemplateInterface",
    "generateTemplateId({ iface }) -- iface object must be an InteractionTemplateInteraction"
  )
  invariant(
    templateInterface.f_version === "1.0.0",
    "generateTemplateId({ iface }) -- iface object must be version 1.0.0"
  )

  const templateData = templateInterface.data

  const _args = Object.keys(templateData?.["arguments"]).map(
    async (argumentKey, index) => ({
      ...templateData?.["arguments"]?.[argumentKey],
      key: argumentKey,
    })
  )

  const newTemplate = {
    ...templateInterface,
    f_version: "1.1.0",
    data: {
      ...templateInterface.data,
      arguments: _args,
    },
  }

  return newTemplate
}
