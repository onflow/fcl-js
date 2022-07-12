import {account, invariant} from "@onflow/sdk"
import {log} from "@onflow/util-logger"
import { encode as rlpEncode, Buffer } from "@onflow/rlp"
import { query } from "../exec/query.js"
import {genHash} from "./utils/hash.js"

export async function generateTemplateId({
    template,
}) {
    invariant(template != undefined, "template must be defined")
    invariant(typeof template === "object", "template must be an object")
    invariant(typeof template.f_type === "InteractionTemplate", "Object must be an InteractionTemplate")

    const templateData = template.data

    const messages = Object.keys(templateData.messages).map(
        messageKey => ([
            messageKey,
            Object.keys(templateData.messages?.[messageKey]?.i18n).map(
                i18nkeylanguage => ([
                    i18nkeylanguage,
                    templateData.messages?.i18n?.[messageKey]?.[i18nkeylanguage]
                ])
            )
        ])
    )

    const dependencies = Object.keys(templateData?.dependencies).map(
        dependencyAddressPlaceholder => ([
            dependencyAddressPlaceholder,
            Object.keys(templateData?.dependencies?.[dependencyAddressPlaceholder]).map(
                dependencyContract => ([
                    dependencyContract,
                    Object.keys(templateData?.dependencies?.[dependencyAddressPlaceholder]?.[dependencyContract]).map(
                        dependencyContractNetwork => ([
                            dependencyContractNetwork,
                            [
                                templateData?.dependencies?.[dependencyAddressPlaceholder]?.[dependencyContract]?.[dependencyContractNetwork].address,
                                templateData?.dependencies?.[dependencyAddressPlaceholder]?.[dependencyContract]?.[dependencyContractNetwork].contract,
                                templateData?.dependencies?.[dependencyAddressPlaceholder]?.[dependencyContract]?.[dependencyContractNetwork].fq_address,
                                templateData?.dependencies?.[dependencyAddressPlaceholder]?.[dependencyContract]?.[dependencyContractNetwork].pin,
                                templateData?.dependencies?.[dependencyAddressPlaceholder]?.[dependencyContract]?.[dependencyContractNetwork].pin_block_height,
                            ]
                        ])
                    )
                ])
            )
        ])
    )

    const _arguments = Object.keys(templateData?.["arguments"]).map(
        argumentLabel => ([
            argumentLabel,
            [
                templateData?.["arguments"]?.[argumentLabel].index,
                templateData?.["arguments"]?.[argumentLabel].type,
                templateData?.["arguments"]?.[argumentLabel].balance || "",
                Object.keys(templateData?.["arguments"]?.[argumentLabel].messages).map(
                    argumentMessageKey => ([
                        argumentMessageKey,
                        Object.keys(templateData?.["arguments"]?.[argumentLabel].messages?.[argumentMessageKey].i18n).map(
                            i18nkeylanguage => ([
                                i18nkeylanguage,
                                templateData?.["arguments"]?.[argumentLabel].messages?.[argumentMessageKey].i18n?.[i18nkeylanguage]
                            ])
                        )
                    ])
                )
            ]
        ])
    )

    console.log("pre rlp encode", [
        templateData?.type,
        templateData?.interface,
        messages,
        templateData?.cadence,
        dependencies,
        _arguments
    ])

    const encodedHex = rlpEncode([
        templateData?.type,
        templateData?.interface,
        messages,
        templateData?.cadence,
        dependencies,
        _arguments
    ]).toString("hex")

    console.log("post rlp encode encodedHex", encodedHex)

    return genHash(encodedHex)
}