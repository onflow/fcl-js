import {invariant} from "@onflow/util-invariant"
import {generateTemplateId as generateTemplateId100} from "./generate-template-id-1.0.0"
import {generateTemplateId as generateTemplateId110} from "./generate-template-id-1.1.0"
import type {InteractionTemplate} from "../interaction-template"

/**
 * @description Generates Interaction Template ID for a given Interaction Template
 *
 * @param params
 * @param params.template Interaction Template
 * @returns Interaction Template ID
 */
export async function generateTemplateId({
  template,
}: {
  template: InteractionTemplate
}): Promise<string> {
  invariant(
    !!template,
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

  switch (template.f_version) {
    case "1.1.0":
      return await generateTemplateId110({template})
    case "1.0.0":
      return await generateTemplateId100({template})
    default:
      throw new Error("generateTemplateId Error: Unsupported template version")
  }
}

/**
 * @description Verifies the given Interaction Template Id has been correctly generated
 *
 * @param params
 * @param params.template Interaction Template
 * @returns true or false, Interaction Template ID
 */
export async function verifyGeneratedTemplateId({
  template,
}: {
  template: InteractionTemplate
}): Promise<boolean> {
  return template.id === (await generateTemplateId({template}))
}
