import {invariant} from "@onflow/sdk"
import {encode as rlpEncode} from "@onflow/rlp"
import {genHash} from "./utils/hash.js"
import {normalizeInteractionTemplate} from "./normalize/interaction-template.js"

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
    typeof template.f_type === "InteractionTemplate",
    "generateTemplateId({ template }) -- template object must be an InteractionTemplate"
  )

  template = normalizeInteractionTemplate(template)

  switch (template.f_version) {
    case "1.0.0":
      const templateData = template.data

      const messages = await Promise.all(
        Object.keys(templateData.messages).map(async messageKey => [
          await genHash(messageKey),
          await Promise.all(
            Object.keys(templateData.messages?.[messageKey]?.i18n).map(
              async i18nkeylanguage => [
                await genHash(i18nkeylanguage),
                await genHash(
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
            await genHash(dependencyAddressPlaceholder),
            await Promise.all(
              Object.keys(
                templateData?.dependencies?.[dependencyAddressPlaceholder]
              ).map(async dependencyContract => [
                await genHash(dependencyContract),
                await Promise.all(
                  Object.keys(
                    templateData?.dependencies?.[
                      dependencyAddressPlaceholder
                    ]?.[dependencyContract]
                  ).map(async dependencyContractNetwork => [
                    await genHash(dependencyContractNetwork),
                    [
                      await genHash(
                        templateData?.dependencies?.[
                          dependencyAddressPlaceholder
                        ]?.[dependencyContract]?.[dependencyContractNetwork]
                          .address
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
        Object.keys(templateData?.["arguments"]).map(async argumentLabel => [
          await genHash(argumentLabel),
          [
            await genHash(
              String(templateData?.["arguments"]?.[argumentLabel].index)
            ),
            await genHash(templateData?.["arguments"]?.[argumentLabel].type),
            await genHash(
              templateData?.["arguments"]?.[argumentLabel].balance || ""
            ),
            await Promise.all(
              Object.keys(
                templateData?.["arguments"]?.[argumentLabel].messages
              ).map(async argumentMessageKey => [
                await genHash(argumentMessageKey),
                await Promise.all(
                  Object.keys(
                    templateData?.["arguments"]?.[argumentLabel].messages?.[
                      argumentMessageKey
                    ].i18n
                  ).map(async i18nkeylanguage => [
                    await genHash(i18nkeylanguage),
                    await genHash(
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

    default:
      throw new Error("generateTemplateId Error: Unsupported template version")
  }
}
