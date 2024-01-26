import {invariant} from "@onflow/sdk"
import {encode as rlpEncode} from "@onflow/rlp"
import {genHash} from "../utils/hash.js"



async function generateSelfPinHash({network, contractName, address}) {
  const pins = []



  return genHash(pins)
}

async function generateNetworkPinHash({network, pin_contract_name, address, imports}) {
  const hashes = []

  for (const imp in imports) {
    const {contract, pin, pin_self, pin_block_height, pin_contract_name, pin_contract_address, imports} = imp
    const hash = await generateSelfPinHash({network, contract, pin, pin_self, pin_block_height, pin_contract_name, pin_contract_address, imports})
    hashes.push(hash)
  }
  return hashes;
}

async function generateContractNetworks(networks) {
  const hashes = []
  for (const net in networks) {
    const {network, address, pin_contract_name, imports} = net
    const hash = await generateNetworkPinHash({network, pin_contract_name, address, imports})
    hashes.push(hash)
  }

  return hashes
}

async function generateContractDependencies(dependencies) {
  const hashes = []
  for (var dependency in dependencies) {
    const contracts = []
    const contractNameHash = await genHash(dependency?.contract);
    contracts.push(contractNameHash)
    contracts.push(...await generateContractNetworks(dependency?.networks))
    hashes.push(...contracts)
  }

  return hashes
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

    const dependencies = await generateContractDependencies(templateData?.dependencies)
/*
    const dependencies = await Promise.all(
        await Promise.all(

            templateData?.dependencies?.map(async dependencyContract => [
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
    )
  )
*/
  const _parameters = await Promise.all(
    templateData?.["parameters"].map(async arg => [
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

  const x = rlpEncode([
    messages
  ]).toString("hex")

  console.log("hashed:", await genHash(x))


  const p = rlpEncode([
    _parameters
  ]).toString("hex")

  console.log("params:", await genHash(p))


  const encodedHex = rlpEncode([
    await genHash("InteractionTemplate"),
    await genHash("1.1.0"),
    await genHash(templateData?.type),
    await genHash(templateData?.interface),
    messages,
    await genHash(templateData?.cadence?.body),
//    dependencies,
    _parameters,
  ]).toString("hex")

  return genHash(encodedHex)
}
