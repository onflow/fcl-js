import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {withPrefix} from "@onflow/util-address"

export async function deriveDependencies({template}) {
  const network = await config.get("flow.network")

  invariant(
    network,
    "FCL configureDependencies Error: Missing configuration value for 'flow.network'"
  )

  const derivedDependencies = {}

  switch (template["f_vsn"]) {
    case "1.0.0":
      const dependencyPlaceholderKeys = Object.keys(
        template?.data?.dependencies
      )
      for (let dependencyPlaceholderKey of dependencyPlaceholderKeys) {
        let dependencyPlacholder =
          template?.data?.dependencies[dependencyPlaceholderKey]

        const dependencyPlacholderContractsKeys =
          Object.keys(dependencyPlacholder)
        invariant(
          dependencyPlacholderContractsKeys.length > 0,
          `FCL configureDependencies Error: No contracts found in template for placeholder=${dependencyPlaceholderKey}`
        )
        const dependencyPlacholderContract =
          dependencyPlacholder[dependencyPlacholderContractsKeys[0]]
        const dependency = dependencyPlacholderContract[network]

        invariant(
          dependency,
          `FCL configureDependencies Error: No dependency information for placholder=${dependencyPlaceholderKey} contract=${dependencyPlacholderContractsKeys[0]} network=${network}`
        )
        invariant(
          dependency?.address,
          `FCL configureDependencies Error: No address information for placholder=${dependencyPlaceholderKey} contract=${dependencyPlacholderContractsKeys[0]} network=${network}`
        )

        derivedDependencies[dependencyPlaceholderKey] = withPrefix(
          dependency?.address
        )
      }

    default:
      throw new Error(
        "FCL configureDependencies Error: Unsupported template version"
      )
  }
}
