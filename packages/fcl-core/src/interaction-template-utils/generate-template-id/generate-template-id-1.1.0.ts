import {encode as rlpEncode} from "@onflow/rlp"
import {invariant} from "@onflow/util-invariant"
import type {
  InteractionTemplate110,
  InteractionTemplateDependency,
  InteractionTemplateI18n,
  InteractionTemplateMessage,
  InteractionTemplateNetwork,
  InteractionTemplateParameter,
} from "../interaction-template"
import {generateDependencyPin110} from "../generate-dependency-pin/generate-dependency-pin-1.1.0"
import {genHash} from "../utils/hash"

async function generateContractNetworks(
  contractName: string,
  networks: InteractionTemplateNetwork[]
): Promise<string[][]> {
  const values: string[][] = []
  for (const net of networks) {
    const networkHashes = [genHash(net.network)]
    const {address, dependency_pin_block_height} = net
    if (net.dependency_pin) {
      const hash = await generateDependencyPin110({
        address,
        contractName,
        blockHeight: dependency_pin_block_height,
      })
      networkHashes.push(genHash(hash))
    }
    values.push(networkHashes)
  }
  return values
}

async function generateContractDependencies(
  dependencies: InteractionTemplateDependency[]
): Promise<any[]> {
  const values: any[] = []
  for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i]
    const contracts = []
    for (let j = 0; j < dependency?.contracts.length; j++) {
      const c = dependency?.contracts[j]
      const contractName = c?.contract
      contracts.push(genHash(contractName))
      const contractHashes = await generateContractNetworks(
        contractName,
        c?.networks
      )
      contracts.push(contractHashes)
    }
    values.push(contracts)
  }
  return values
}

/**
 * @description Generates Interaction Template ID for a given Interaction Template
 *
 * @param {object} params
 * @param {InteractionTemplate110} params.template Interaction Template
 * @returns {Promise<string>} Interaction Template ID
 */
export async function generateTemplateId({
  template,
}: {
  template: InteractionTemplate110
}): Promise<string> {
  invariant(
    template as any,
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
    template.f_version === "1.1.0",
    "generateTemplateId({ template }) -- template object must be an version 1.1.0"
  )

  const templateData = template.data

  const messages = await Promise.all(
    templateData.messages.map(
      async (templateMessage: InteractionTemplateMessage) => [
        genHash(templateMessage.key),
        await Promise.all(
          templateMessage.i18n.map(
            async (templateMessagei18n: InteractionTemplateI18n) => [
              genHash(templateMessagei18n.tag),
              genHash(templateMessagei18n.translation),
            ]
          )
        ),
      ]
    )
  )

  const params = await Promise.all(
    templateData?.["parameters"]
      .sort(
        (a: InteractionTemplateParameter, b: InteractionTemplateParameter) =>
          a.index - b.index
      )
      .map(async (arg: InteractionTemplateParameter) => [
        genHash(arg.label),
        [
          genHash(String(arg.index)),
          genHash(arg.type),
          await Promise.all(
            arg.messages.map(
              async (argumentMessage: InteractionTemplateMessage) => [
                genHash(argumentMessage.key),
                await Promise.all(
                  argumentMessage.i18n.map(
                    async (argumentMessagei18n: InteractionTemplateI18n) => [
                      genHash(argumentMessagei18n.tag),
                      genHash(argumentMessagei18n.translation),
                    ]
                  )
                ),
              ]
            )
          ),
        ],
      ])
  )

  const dependencies = [
    await generateContractDependencies(templateData?.dependencies),
  ]

  const encodedHex = rlpEncode([
    genHash(template?.f_type),
    genHash(template?.f_version),
    genHash(templateData?.type),
    genHash(templateData?.interface),
    messages,
    genHash(templateData?.cadence?.body),
    [dependencies],
    params,
  ]).toString("hex")

  return genHash(encodedHex)
}
