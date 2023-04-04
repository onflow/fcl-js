import {invariant} from "@onflow/sdk"
import {generateTemplateInterfaceId as generateTemplateInterfaceId100} from "./generate-template-id-1.0.0.js"
import {generateTemplateInterfaceId as generateTemplateInterfaceId110} from "./generate-template-id-1.0.0.js"

/**
 * @description Generates Interaction Template Interface ID for a given Interaction Template Interface
 *
 * @param {object} params
 * @param {object} params.templateInterface - Interaction Template Interface
 * @returns {Promise<string>} - Interaction Template Interface ID
 */
export async function generateTemplateInterfaceId({templateInterface}) {
  invariant(
    templateInterface != undefined,
    "generateTemplateInterfaceId({ templateInterface }) -- templateInterface must be defined"
  )
  invariant(
    typeof templateInterface === "object",
    "generateTemplateInterfaceId({ templateInterface }) -- templateInterface must be an object"
  )
  invariant(
    typeof templateInterface.f_type === "InteractionTemplateInterface",
    "generateTemplateInterfaceId({ templateInterface }) -- templateInterface object must be an InteractionTemplate"
  )

  templateInterface = normalizeInteractionTemplateInterface(templateInterface)

  switch (templateInterface.f_version) {
    case "1.1.0":
      return await generateTemplateInterfaceId110({templateInterface})
    case "1.0.0":
      return await generateTemplateInterfaceId100({templateInterface})
    default:
      throw new Error(
        "generateTemplateInterfaceId Error: Unsupported templateInterface version"
      )
  }
}
