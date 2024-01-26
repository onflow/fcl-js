import {invariant} from "@onflow/sdk"
import {normalizeInteractionTemplate} from "../../normalizers/interaction-template/interaction-template"

/**
 * @description Fills import addresses in Cadence for network
 *
 * @param {object} params
 * @param {string} params.network - Network to derive Cadence for
 * @param {object} params.template - Interaction Template to derive Cadence from
 * @returns {string} - Cadence
 */
export async function deriveCadenceByNetwork({network, template}) {
   // get network dependencies from template dependencies, use new string import format
   const networkDeps = {}

   invariant(
    network != undefined,
    "deriveCadenceByNetwork({ network }) -- network must be defined"
  )
  invariant(
    typeof network === "string",
    "deriveCadenceByNetwork({ network }) -- network must be a string"
  )

  invariant(
    template != undefined,
    "generateDependencyPin({ template }) -- template must be defined"
  )
  invariant(
    typeof template === "object",
    "generateDependencyPin({ template }) -- template must be an object"
  )
  invariant(
    template.f_type === "InteractionTemplate",
    "generateDependencyPin({ template }) -- template must be an InteractionTemplate"
  )

  template = normalizeInteractionTemplate(template)

   template?.data?.dependencies.forEach(dependency => {
     dependency.contracts.forEach(contract => {
       const contractName = contract.contract
       contract.networks.forEach(net => {
         if (net.network === network) {
           networkDeps[contractName] = net.address
         }
       })

       invariant(
         networkDeps[contractName],
         `networkAddress -- Could not find contracts Network Address: ${network} ${contractName}`
       )          
     })
   })

   invariant(
     Object.keys(networkDeps).length === template?.data?.dependencies.length,
     `networkDeps -- Could not find contracts for import dependencies: ${networkDeps}`
   )

   invariant(
     Object.keys(networkDeps).length === Object.values(networkDeps).length,
     `networkDeps -- Could not find all addresses for network ${network} dependencies:  ${networkDeps}`
   )

   return Object.keys(networkDeps).reduce((cadence, contractName) => {
     const test = new RegExp(`\\bimport\\b\\s*\\\"${contractName}\\\"`, "g")
     return cadence.replace(test, `import ${contractName} from ${networkDeps[contractName]}`)
   }, template.data.cadence.body)
}
