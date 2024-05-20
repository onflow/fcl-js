import {invariant} from "@onflow/sdk"
import {encode as rlpEncode} from "@onflow/rlp"
import {genHash} from "../utils/hash.js"

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
    Object.keys(templateData.messages).map(async messageKey => [
      genHash(messageKey),
      await Promise.all(
        Object.keys(templateData.messages?.[messageKey]?.i18n).map(
          async i18nkeylanguage => [
            genHash(i18nkeylanguage),
            genHash(
              templateData.messages?.[messageKey]?.i18n?.[i18nkeylanguage]
            ),
          ]
        )
      ),
    ])
  )

  const dependencies = await Promise.all(
    Object.keys(templateData?.dependencies).map(
      async dependencyAddressPlaceholder => [
        genHash(dependencyAddressPlaceholder),
        await Promise.all(
          Object.keys(
            templateData?.dependencies?.[dependencyAddressPlaceholder]
          ).map(async dependencyContract => [
            genHash(dependencyContract),
            await Promise.all(
              Object.keys(
                templateData?.dependencies?.[dependencyAddressPlaceholder]?.[
                  dependencyContract
                ]
              ).map(async dependencyContractNetwork => [
                genHash(dependencyContractNetwork),
                [
                  genHash(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]?.[dependencyContractNetwork].address
                  ),
                  genHash(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]?.[dependencyContractNetwork]
                      .contract
                  ),
                  genHash(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]?.[dependencyContractNetwork]
                      .fq_address
                  ),
                  genHash(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]?.[dependencyContractNetwork].pin
                  ),
                  genHash(
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
    Object.keys(templateData?.["arguments"]).map(async argumentLabel => [
      genHash(argumentLabel),
      [
        genHash(String(templateData?.["arguments"]?.[argumentLabel].index)),
        genHash(templateData?.["arguments"]?.[argumentLabel].type),
        genHash(templateData?.["arguments"]?.[argumentLabel].balance || ""),
        await Promise.all(
          Object.keys(
            templateData?.["arguments"]?.[argumentLabel].messages
          ).map(async argumentMessageKey => [
            genHash(argumentMessageKey),
            await Promise.all(
              Object.keys(
                templateData?.["arguments"]?.[argumentLabel].messages?.[
                  argumentMessageKey
                ].i18n
              ).map(async i18nkeylanguage => [
                genHash(i18nkeylanguage),
                genHash(
                  templateData?.["arguments"]?.[argumentLabel].messages?.[
                    argumentMessageKey
                  ].i18n?.[i18nkeylanguage]
                ),
              ])
            ),
          ])
        ),
      ],
    ])
  )

  const encodedHex = rlpEncode([
    genHash("InteractionTemplate"),
    genHash("1.0.0"),
    genHash(templateData?.type),
    genHash(templateData?.interface),
    messages,
    genHash(templateData?.cadence),
    dependencies,
    _arguments,
  ]).toString("hex")

  return genHash(encodedHex)
}
