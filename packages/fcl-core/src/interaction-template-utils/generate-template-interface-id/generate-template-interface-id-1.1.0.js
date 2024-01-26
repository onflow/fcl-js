import {invariant} from "@onflow/sdk"
import {encode as rlpEncode} from "@onflow/rlp"
import {genHash} from "./utils/hash.js"

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
    templateInterface.f_type === "InteractionTemplateInterface",
    "generateTemplateInterfaceId({ templateInterface }) -- templateInterface object must be an InteractionTemplate"
  )
  invariant(
    templateInterface.f_version === "1.1.0",
    "generateTemplateInterfaceId({ templateInterface }) -- templateInterface object must be version 1.1.0"
  )

  const interfaceData = templateInterface.data

  const encodedHex = rlpEncode([
    await genHash("InteractionTemplateInterface"),
    await genHash("1.1.0"),
    await genHash(interfaceData.flip),
    await Promise.all(
      interfaceData.arguments.map(async arg => [
        await genHash(arg.label),
        await genHash(String(arg.index)),
        await genHash(arg.type),
      ])
    ),
  ]).toString("hex")

  return genHash(encodedHex)
}
