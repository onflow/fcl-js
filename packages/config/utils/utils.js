const pipe =
  (...funcs) =>
  v => {
    return funcs.reduce((res, func) => {
      return func(res)
    }, v)
  }

/***
 * Merge multiple functions returning objects into one object.
 * @param {...function(*): object} funcs - Functions to merge
 * @return {object} - Merged object
 */
const mergePipe =
  (...funcs) =>
  v => {
    return funcs.reduce((res, func) => {
      return {...res, ...func(v)}
    }, {})
  }

/**
 * @description Object check
 * @param {*} value - Value to check
 * @returns {boolean} - Is object status
 */
const isObject = value =>
  value && typeof value === "object" && !Array.isArray(value)

/**
 * @description Deep merge multiple objects.
 * @param {object} target - Target object
 * @param {...object[]} sources - Source objects
 * @returns {object} - Merged object
 */
const mergeDeep = (target, ...sources) => {
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
 * @param {function(object): boolean} testFn - Function to test
 * @param {function(object): *} posCond - Function to run if testFn is true
 * @param {function(object): *} negCond - Function to run it testFn is false
 * @returns {function(*): *} - Function that returns the result of posCond or negCond
 */
export const ifElse = (testFn, posCond, negCond) => obj =>
  testFn(obj) ? posCond(obj) : negCond(obj)

/**
 * @description Deep merge multiple Flow JSON.
 * @param {object|object[]} value - Flow JSON or array of Flow JSONs
 * @returns {object} - Merged Flow JSON
 */
const mergeFlowJSONs = value =>
  Array.isArray(value) ? mergeDeep({}, ...value) : value

/**
 * @description Filter out contracts section of flow.json.
 * @param {object|object[]} obj - Flow JSON or array of Flow JSONs
 * @returns {object} - Contracts section of Flow JSON
 */
const filterContracts = obj => (obj.contracts ? obj.contracts : {})

/**
 * @description Gathers contract addresses by network
 * @param {string} network - Network to gather addresses for
 * @returns {object} - Contract names by addresses mapping e.g { "HelloWorld": "0x123" }
 */
const mapContractAliasesToNetworkAddress = network => contracts => {
  return Object.entries(contracts).reduce((c, [key, value]) => {
    const networkContractAlias = value?.aliases?.[network]
    if (networkContractAlias) {
      c[key] = networkContractAlias
    }

    return c
  }, {})
}

const mapDeploymentsToNetworkAddress =
  network =>
  ({deployments = {}, accounts = {}}) => {
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
 * @param {object|object[]} jsons - Flow JSON or array of Flow JSONs
 * @param {string} network - Network to gather addresses for
 * @returns {object} - Contract names by addresses mapping e.g { "HelloWorld": "0x123" }
 */
export const getContracts = (jsons, network) => {
  return pipe(
    mergeFlowJSONs,
    mergePipe(
      mapDeploymentsToNetworkAddress(network),
      pipe(filterContracts, mapContractAliasesToNetworkAddress(network))
    )
  )(jsons)
}

/**
 * @description Checks if string is hexidecimal
 * @param {string} str - String to check
 * @returns {boolean} - Is hexidecimal status
 */
const isHexidecimal = str => {
  // Check that it is a string
  if (typeof str !== "string") return false
  return /^[0-9A-Fa-f]+$/.test(str)
}

/**
 * @description Checks flow.json file for private keys
 * @param {object} flowJSON - Flow JSON
 * @returns {boolean} - Has private keys status
 */
const hasPrivateKeys = flowJSON => {
  return Object.entries(flowJSON?.accounts).reduce(
    (hasPrivateKey, [key, value]) => {
      if (hasPrivateKey) return true
      return value?.hasOwnProperty("key") && isHexidecimal(value?.key)
    },
    false
  )
}

/**
 * @description Take in flow.json or array of flow.json files and checks for private keys
 * @param {object|object[]} value - Flow JSON or array of Flow JSONs
 * @returns {boolean} - Has private keys status
 */
export const anyHasPrivateKeys = value => {
  if (isObject(value)) return hasPrivateKeys(value)
  return value.some(hasPrivateKeys)
}

/**
 * @description Format network to always be 'emulator', 'testnet', or 'mainnet'
 * @param {string} network - Network to format
 * @returns {string} - Formatted network name (either 'emulator', 'testnet', or 'mainnet')
 */
export const cleanNetwork = network =>
  network?.toLowerCase() === "local" ? "emulator" : network?.toLowerCase()
