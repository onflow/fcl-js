type FlowNetwork = "emulator" | "testnet" | "mainnet" | "previewnet"
export interface FlowJson {
  networks?: {
    [key in FlowNetwork]?: string
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
        [key in FlowNetwork]?: string
      }
    }
  }
  dependencies?: {
    [key: string]: {
      source: string
      hash: string
      aliases: {
        [key in FlowNetwork]?: string
      }
    }
  }
  deployments?: {
    [key in FlowNetwork]?: {
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
 * @returns Contract names by addresses mapping e.g { "HelloWorld": "0x123" }
 */
const mapContractAliasesToNetworkAddress =
  (network: string) => (contracts: Record<string, any>) => {
    return Object.entries(contracts).reduce(
      (c, [key, value]) => {
        const networkContractAlias = value?.aliases?.[network]
        if (networkContractAlias) {
          c[key] = networkContractAlias
        }

        return c
      },
      {} as Record<string, string>
    )
  }

/**
 * @description Gathers dependency addresses by network
 * @param network - Network to gather addresses for
 * @returns Dependency names by addresses mapping e.g { "HelloWorld": "0x123" }
 */
const mapDependencyAliasesToNetworkAddress =
  (network: string) => (dependencies: Record<string, any>) => {
    return Object.entries(dependencies).reduce(
      (c, [key, value]) => {
        const networkDependencyAlias = value?.aliases?.[network]
        if (networkDependencyAlias) {
          c[key] = networkDependencyAlias
        }

        return c
      },
      {} as Record<string, string>
    )
  }

const mapDeploymentsToNetworkAddress =
  (network: FlowNetwork) =>
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
      return value.reduce((c, contract) => {
        return {...c, [contract]: accountAddress}
      }, {})
    }, {})
  }

/**
 * @description Take in flow.json files and return contract to address mapping by network
 * @param jsons - Flow JSON or array of Flow JSONs
 * @param network - Network to gather addresses for
 * @returns Contract names by addresses mapping e.g { "HelloWorld": "0x123" }
 */
export const getContracts = (
  jsons: FlowJson | FlowJson[],
  network: FlowNetwork
) => {
  return pipe(
    mergeFlowJSONs,
    mergePipe(
      mapDeploymentsToNetworkAddress(network),
      pipe(filterContracts, mapContractAliasesToNetworkAddress(network)),
      pipe(filterDependencies, mapDependencyAliasesToNetworkAddress(network))
    )
  )(jsons)
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
 * @description Format network to always be 'emulator', 'testnet', 'previewnet' or 'mainnet'
 * @param network - Network to format
 * @returns Formatted network name (either 'emulator', 'testnet', 'previewnet' or 'mainnet')
 */
export const cleanNetwork = (network: string): FlowNetwork => {
  const cleanedNetwork =
    network?.toLowerCase() === "local" ? "emulator" : network?.toLowerCase()
  if (
    cleanedNetwork === "emulator" ||
    cleanedNetwork === "testnet" ||
    cleanedNetwork === "mainnet" ||
    cleanedNetwork === "previewnet"
  )
    return cleanedNetwork

  throw new Error(
    `Invalid network "${network}". Must be one of "emulator", "local", "testnet", or "mainnet"`
  )
}
