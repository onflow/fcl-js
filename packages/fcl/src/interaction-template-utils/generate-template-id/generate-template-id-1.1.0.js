import {invariant} from "@onflow/sdk"
import {encode as rlpEncode} from "@onflow/rlp"
import {genHash} from "./utils/hash.js"
import {normalizeInteractionTemplate} from "../normalizers/interaction-template/interaction-template.js"

/**
 * @description Generates Interaction Template ID for a given Interaction Template
 *
 * @param {object} params
 * @param {object} params.template - Interaction Template
 * @returns {Promise<string>} - Interaction Template ID
 */
export async function generateTemplateId({template}) {
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
  invariant(
    template.f_version === "1.0.0",
    "generateTemplateId({ template }) -- template object must be an version 1.0.0"
  )

  const templateData = template.data

  const messages = await Promise.all(
    templateData.messages.map(async templateMessage => [
      await genHash(templateMessage.key),
      await Promise.all(
        templateMessage.i18n.map(async templateMessagei18n => [
          await genHash(templateMessagei18n.tag),
          await genHash(templateMessagei18n.translation),
        ])
      ),
    ])
  )

  const dependencies = await Promise.all(
    Object.keys(templateData?.dependencies).map(
      async dependencyAddressPlaceholder => [
        await genHash(dependencyAddressPlaceholder),
        await Promise.all(
          Object.keys(
            templateData?.dependencies?.[dependencyAddressPlaceholder]
          ).map(async dependencyContract => [
            await genHash(dependencyContract),
            await Promise.all(
              Object.keys(
                templateData?.dependencies?.[dependencyAddressPlaceholder]?.[
                  dependencyContract
                ]
              ).map(async dependencyContractNetwork => [
                await genHash(dependencyContractNetwork),
                [
                  await genHash(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]?.[dependencyContractNetwork].address
                  ),
                  await genHash(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]?.[dependencyContractNetwork]
                      .contract
                  ),
                  await genHash(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]?.[dependencyContractNetwork]
                      .fq_address
                  ),
                  await genHash(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]?.[dependencyContractNetwork].pin
                  ),
                  await genHash(
                    String(
                      templateData?.dependencies?.[
                        dependencyAddressPlaceholder
                      ]?.[dependencyContract]?.[dependencyContractNetwork]
                        .pin_block_height
                    )
                  ),
                ],
              ])
            ),
          ])
        ),
      ]
    )
  )

  const _arguments = await Promise.all(
    templateData?.["arguments"].map(async arg => [
      await genHash(arg.label),
      [
        await genHash(String(arg.index)),
        await genHash(arg.type),
        await genHash(arg.balance || ""),
        await Promise.all(
          arg.messages.map(async argumentMessage => [
            await genHash(argumentMessage.key),
            await Promise.all(
              argumentMessage.i18n.map(async argumentMessagei18n => [
                await genHash(argumentMessagei18n.tag),
                await genHash(argumentMessagei18n.translation),
              ])
            ),
          ])
        ),
      ],
    ])
  )

  const encodedHex = rlpEncode([
    await genHash("InteractionTemplate"),
    await genHash("1.0.0"),
    await genHash(templateData?.type),
    await genHash(templateData?.interface),
    messages,
    await genHash(templateData?.cadence),
    dependencies,
    _arguments,
  ]).toString("hex")

  return genHash(encodedHex)

  return genHash(encodedHex)
}
