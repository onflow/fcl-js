/**
 * Fork network configuration
 * Allows a custom network to inherit contract aliases from a parent network
 */
export interface ForkNetworkConfig {
  host: string
  fork: string
}

/**
 * Network configuration - either a string (host) or fork configuration
 */
export type NetworkConfig = string | ForkNetworkConfig

export interface FlowJson {
  networks?: {
    [key: string]: NetworkConfig
  }
  accounts?: {
    [key: string]: {
      address: string
      key?: string | object
    }
  }
  contracts?: {
    [key: string]: {
      source: string
      aliases: {
        [key: string]: string
      }
      // Optional canonical field for import aliases
      // When set, indicates this contract is an alias of another contract
      // Example: FUSD1 has canonical="FUSD" means FUSD1 is an alias of FUSD
      // Results in: import FUSD as FUSD1 from 0x...
      canonical?: string
    }
  }
  dependencies?: {
    [key: string]: {
      source: string
      hash: string
      aliases: {
        [key: string]: string
      }
      // Optional canonical field for import aliases
      // When set, indicates this dependency is an alias of another contract
      // Example: FungibleTokenV2 has canonical="FungibleToken"
      // Results in: import FungibleToken as FungibleTokenV2 from 0x...
      canonical?: string
    }
  }
  deployments?: {
    [key: string]: {
      [contract: string]: string[]
    }
  }
}

const pipe =
  (...funcs: ((v: any) => any)[]) =>
  (v: any) => {
    return funcs.reduce((res, func) => {
      return func(res)
    }, v)
  }

/***
 * Merge multiple functions returning objects into one object.
 * @param funcs - Functions to merge
 * @return Merged object
 */
const mergePipe =
  (...funcs: ((v: any) => any)[]) =>
  (v: any) => {
    return funcs.reduce((res, func) => {
      return {...res, ...func(v)}
    }, {})
  }

/**
 * @description Object check
 * @param value - Value to check
 * @returns Is object status
 */
const isObject = <T>(value: T): boolean =>
  value && typeof value === "object" && !Array.isArray(value)

/**
 * @description Deep merge multiple objects.
 * @param target - Target object
 * @param sources - Source objects
 * @returns Merged object
 */
const mergeDeep = (target: any, ...sources: any[]): any => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {[key]: {}})
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, {[key]: source[key]})
      }
    }
  }

  return mergeDeep(target, ...sources)
}

/**
 * @description Support if/then/else behavior in a function way.
 * @param testFn - Function to test
 * @param posCond - Function to run if testFn is true
 * @param negCond - Function to run it testFn is false
 * @returns Function that returns the result of posCond or negCond
 */
export const ifElse =
  <T, U>(testFn: (v: T) => U, posCond: (v: T) => U, negCond: (v: T) => U) =>
  (v: T) =>
    testFn(v) ? posCond(v) : negCond(v)

/**
 * @description Deep merge multiple Flow JSON.
 * @param value - Flow JSON or array of Flow JSONs
 * @returns Merged Flow JSON
 */
const mergeFlowJSONs = (value: FlowJson | FlowJson[]) =>
  Array.isArray(value) ? mergeDeep({}, ...value) : value

/**
 * @description Filter out contracts section of flow.json.
 * @param obj - Flow JSON
 * @returns Contracts section of Flow JSON
 */
const filterContracts = (obj: FlowJson) => (obj.contracts ? obj.contracts : {})

/**
 * @description Filter out dependencies section of flow.json.
 * @param obj - Flow JSON
 * @returns Dependencies section of Flow JSON
 */
const filterDependencies = (obj: FlowJson) =>
  obj.dependencies ? obj.dependencies : {}

/**
 * @description Gathers contract addresses by network
 * @param network - Network to gather addresses for
 * @param fallbackNetwork - Optional fallback network for fork networks
 * @returns Contract names by addresses mapping e.g { "HelloWorld": "0x123" }
 */
const mapContractAliasesToNetworkAddress =
  (network: string, fallbackNetwork?: string) =>
  (contracts: Record<string, any>) => {
    return Object.entries(contracts).reduce(
      (c, [key, value]) => {
        const alias =
          value?.aliases?.[network] ||
          (fallbackNetwork && value?.aliases?.[fallbackNetwork])
        if (alias) {
          c[key] = alias
        }
        return c
      },
      {} as Record<string, string>
    )
  }

/**
 * @description Gathers dependency addresses by network
 * @param network - Network to gather addresses for
 * @param fallbackNetwork - Optional fallback network for fork networks
 * @returns Dependency names by addresses mapping e.g { "HelloWorld": "0x123" }
 */
const mapDependencyAliasesToNetworkAddress =
  (network: string, fallbackNetwork?: string) =>
  (dependencies: Record<string, any>) => {
    return Object.entries(dependencies).reduce(
      (c, [key, value]) => {
        const alias =
          value?.aliases?.[network] ||
          (fallbackNetwork && value?.aliases?.[fallbackNetwork])
        if (alias) {
          c[key] = alias
        }
        return c
      },
      {} as Record<string, string>
    )
  }

/**
 * @description Gathers contract canonical references for import aliases
 * @param contracts - Contracts from flow.json
 * @returns Contract canonical names mapping e.g { "FUSD1.canonical": "FUSD" }
 *
 * Import aliases allow multiple deployments of the same contract to different addresses.
 * The canonical field specifies the actual contract name in the source code.
 *
 * Example:
 * - Input: { FUSD1: { canonical: "FUSD" } }
 * - Output: { "FUSD1.canonical": "FUSD" }
 * - Config stored as: system.contracts.FUSD1.canonical = "FUSD"
 * - Resolves to: import FUSD as FUSD1 from 0x...
 */
const mapContractCanonicals = (contracts: Record<string, any>) => {
  return Object.entries(contracts).reduce(
    (c, [key, value]) => {
      if (value?.canonical) {
        c[`${key}.canonical`] = value.canonical
      }
      return c
    },
    {} as Record<string, string>
  )
}

/**
 * @description Gathers dependency canonical references for import aliases
 * @param dependencies - Dependencies from flow.json
 * @returns Dependency canonical names mapping e.g { "FungibleTokenV2.canonical": "FungibleToken" }
 *
 * Import aliases allow multiple deployments of the same contract to different addresses.
 * The canonical field specifies the actual contract name in the source code.
 *
 * Example:
 * - Input: { FungibleTokenV2: { canonical: "FungibleToken" } }
 * - Output: { "FungibleTokenV2.canonical": "FungibleToken" }
 * - Config stored as: system.contracts.FungibleTokenV2.canonical = "FungibleToken"
 * - Resolves to: import FungibleToken as FungibleTokenV2 from 0x...
 */
const mapDependencyCanonicals = (dependencies: Record<string, any>) => {
  return Object.entries(dependencies).reduce(
    (c, [key, value]) => {
      if (value?.canonical) {
        c[`${key}.canonical`] = value.canonical
      }
      return c
    },
    {} as Record<string, string>
  )
}

const mapDeploymentsToNetworkAddress =
  (network: string) =>
  ({
    deployments = {},
    accounts = {},
  }: Pick<FlowJson, "deployments" | "accounts">) => {
    const networkDeployment = deployments?.[network]
    if (!networkDeployment) return {}

    return Object.entries(networkDeployment).reduce((c, [key, value]) => {
      // Resolve account address
      const accountAddress = accounts[key]?.address
      if (!accountAddress) return c

      // Create an object assigning the address to the contract name.
      return value.reduce((acc, contract) => {
        return {...acc, [contract]: accountAddress}
      }, c)
    }, {})
  }

/**
 * @description Take in flow.json files and return contract to address mapping by network
 * @param jsons - Flow JSON or array of Flow JSONs
 * @param network - Network to gather addresses for (can be a fork network)
 * @returns Contract names by addresses mapping including canonical references
 *
 * Returns both contract addresses and canonical references for import aliases:
 * - Contract addresses: { "HelloWorld": "0x123", "FUSD1": "0xe223..." }
 * - Canonical references: { "FUSD1.canonical": "FUSD" }
 *
 * These are stored in config as:
 * - system.contracts.FUSD1 = "0xe223..."
 * - system.contracts.FUSD1.canonical = "FUSD"
 *
 * The canonical reference enables import alias resolution:
 * - import "FUSD1" → import FUSD as FUSD1 from 0xe223...
 *
 * Fork networks use fallback resolution:
 * - First collects all aliases from the parent network (e.g., "mainnet")
 * - Then overlays aliases from the fork network (e.g., "mainnet-fork")
 * - This allows fork-specific overrides while inheriting the rest
 */
export const getContracts = (jsons: FlowJson | FlowJson[], network: string) => {
  const mergedJson = mergeFlowJSONs(jsons)

  // Determine fallback network for fork networks
  const networkConfig = mergedJson.networks?.[network]
  const fallbackNetwork =
    networkConfig &&
    typeof networkConfig === "object" &&
    "fork" in networkConfig
      ? networkConfig.fork
      : undefined

  return mergePipe(
    mapDeploymentsToNetworkAddress(network),
    pipe(
      filterContracts,
      mapContractAliasesToNetworkAddress(network, fallbackNetwork)
    ),
    pipe(
      filterDependencies,
      mapDependencyAliasesToNetworkAddress(network, fallbackNetwork)
    ),
    pipe(filterContracts, mapContractCanonicals),
    pipe(filterDependencies, mapDependencyCanonicals)
  )(mergedJson)
}

/**
 * @description Checks if string is hexidecimal
 * @param str - String to check
 * @returns Is hexidecimal status
 */
const isHexidecimal = (str: unknown) => {
  // Check that it is a string
  if (typeof str !== "string") return false
  return /^[0-9A-Fa-f]+$/.test(str)
}

/**
 * @description Checks flow.json file for private keys
 * @param flowJSON - Flow JSON
 * @returns Has private keys status
 */
const hasPrivateKeys = (flowJSON: FlowJson) => {
  return Object.entries(flowJSON?.accounts ?? []).reduce(
    (hasPrivateKey, [, value]) => {
      if (hasPrivateKey) return true
      return (
        value &&
        Object.prototype.hasOwnProperty.call(value, "key") &&
        isHexidecimal(value?.key)
      )
    },
    false
  )
}

/**
 * @description Take in flow.json or array of flow.json files and checks for private keys
 * @param value - Flow JSON or array of Flow JSONs
 * @returns Has private keys status
 */
export const anyHasPrivateKeys = (value: FlowJson | FlowJson[]) => {
  if (Array.isArray(value)) return value.some(hasPrivateKeys)
  return hasPrivateKeys(value)
}

/**
 * @description Format network name, converting 'local' to 'emulator'
 * @param network - Network to format
 * @returns Formatted network name
 *
 * This function now accepts any network name (including custom fork networks).
 * It only transforms "local" to "emulator" for backward compatibility.
 */
export const cleanNetwork = (network: string): string => {
  return network?.toLowerCase() === "local"
    ? "emulator"
    : network?.toLowerCase()
}
