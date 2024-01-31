import {invariant} from "@onflow/util-invariant"
import {encode as rlpEncode} from "@onflow/rlp"
import {genHash} from "../utils/hash.js"
import {generateDependencyPin110} from "../generate-dependency-pin/generate-dependency-pin-1.1.0.js"

async function generateContractNetworks(contractName, networks) {
  const values = []
  for (const net of networks) {
    const networkHashes = [await genHash(net.network)]
    const {address, dependency_pin_block_height} = net
    if (net.dependency_pin) {
      const hash = await generateDependencyPin110({
        address,
        contractName,
        blockHeight: dependency_pin_block_height,
      })
      networkHashes.push(await genHash(hash))
    }
    values.push(networkHashes)
  }
  return values
}

async function generateContractDependencies(dependencies) {
  const values = []
  for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i]
    const contracts = []
    for (let j = 0; j < dependency?.contracts.length; j++) {
      const c = dependency?.contracts[j]
      const contractName = c?.contract
      contracts.push(await genHash(contractName))
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
 * @param {object} params.template - Interaction Template
 * @returns {Promise<string>} - Interaction Template ID
 */
export async function generateTemplateId({template}) {
  invariant(
    template,
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

  const params = await Promise.all(
    templateData?.["parameters"]
      .sort((a, b) => a.index - b.index)
      .map(async arg => [
        await genHash(arg.label),
        [
          await genHash(String(arg.index)),
          await genHash(arg.type),
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

  const dependencies = [
    await generateContractDependencies(templateData?.dependencies),
  ]

  const encodedHex = rlpEncode([
    await genHash(template?.f_type),
    await genHash(template?.f_version),
    await genHash(templateData?.type),
    await genHash(templateData?.interface),
    messages,
    await genHash(templateData?.cadence?.body),
    [dependencies],
    params,
  ]).toString("hex")

  return genHash(encodedHex)
}
