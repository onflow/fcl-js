import {invariant} from "@onflow/util-invariant"
import {withPrefix} from "@onflow/util-address"
import {getChainId} from "../../utils"

export async function deriveDependencies(opts = {}) {
  const template = opts.template
  const network = await getChainId(opts)

  const derivedDependencies = {}

  switch (template["f_version"]) {
    case "1.0.0":
      const dependencyPlaceholderKeys = Object.keys(
        template?.data?.dependencies
      )
      for (let dependencyPlaceholderKey of dependencyPlaceholderKeys) {
        let dependencyPlaceholder =
          template?.data?.dependencies[dependencyPlaceholderKey]

        const dependencyPlaceholderContractsKeys = Object.keys(
          dependencyPlaceholder
        )
        invariant(
          dependencyPlaceholderContractsKeys.length > 0,
          `FCL configureDependencies Error: No contracts found in template for placeholder=${dependencyPlaceholderKey}`
        )
        const dependencyPlaceholderContract =
          dependencyPlaceholder[dependencyPlaceholderContractsKeys[0]]
        const dependency = dependencyPlaceholderContract[network]

        invariant(
          dependency,
          `FCL configureDependencies Error: No dependency information for placeholder=${dependencyPlaceholderKey} contract=${dependencyPlaceholderContractsKeys[0]} network=${network}`
        )
        invariant(
          dependency?.address,
          `FCL configureDependencies Error: No address information for placeholder=${dependencyPlaceholderKey} contract=${dependencyPlaceholderContractsKeys[0]} network=${network}`
        )

        derivedDependencies[dependencyPlaceholderKey] = withPrefix(
          dependency?.address
        )
      }

      return derivedDependencies

    case "1.1.0":
      template?.data?.dependencies?.forEach(dependency => {
        dependency.contracts.forEach(contract => {
          const contractName = contract.contract
          contract.networks.forEach(net => {
            if (net.network === network) {
              derivedDependencies[contractName] = withPrefix(net?.address)
            }
          })

          invariant(
            derivedDependencies[contractName],
            `networkAddress -- Could not find contracts Network Address: ${network} ${contractName}`
          )
        })
      })

      return derivedDependencies

    default:
      throw new Error(
        "FCL configureDependencies Error: Unsupported template version"
      )
  }
}
