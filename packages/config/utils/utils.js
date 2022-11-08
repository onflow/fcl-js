const pipe = (...funcs) => v => {
  return funcs.reduce((res, func) => {
    return func(res)
  }, v)
}

/**
 * Object check.
 * @param value
 * @returns {boolean}
 */
const isObject = value => value && typeof value === 'object' && !Array.isArray(value)

/**
 * Deep merge multiple objects.
 * @param {Object} target
 * @param {Object[]} ...sources
 * @returns {Object}
 */
const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

/**
 * Deep merge multiple Flow JSON.
 * @param {Object|Object[]} value
 * @returns {Object}
 */
const mergeFlowJSONs = value => Array.isArray(value) ? mergeDeep({}, ...value) : value

/**
 * Filter out contracts section of flow.json.
 * @param {Object|Object[]} value
 * @returns {Object}
 */
const filterContracts = obj => obj.contracts ? obj.contracts : {}

/**
 * Gathers contract addresses by network
 * @param {string} network local, emulator, testnet, mainnet
 * @returns {Object} { "HelloWorld": "f8d6e0586b0a20c7" }
 */
const getContractsByNetwork = network => contracts => {
  return Object.entries(contracts).reduce((c, [key, value]) => {
    const networkContractAlias = value?.aliases?.[network]
    if (networkContractAlias) {
      c[key] = networkContractAlias
    }

    return c
  }, {})
}

/**
 * Take in flow.json files and return combined contracts
 * @param {Object|Object[]} value
 * @returns {Object}
 */
export const accumulate = (jsons, network) => {
  return pipe(
    mergeFlowJSONs,
    filterContracts,
    getContractsByNetwork(network)
  )(jsons)
}

/**
 * Take in flow.json file for private keys
 * @param {Object} flowJSON
 * @returns {boolean}
 */
export const hasPrivateKeys = flowJSON => {
  return Object.entries(flowJSON?.accounts).reduce((hasPrivateKey, [key, value]) => {
    if (hasPrivateKey) return true
    return value?.hasOwnProperty("key")
  }, false)
}

/**
 * Format network to always be 'emulator', 'testnet', or 'mainnet'
 * @param {string} network
 * @returns {string}
 */
export const cleanNetwork = network => network.toLowerCase() === 'local' ? 'emulator' : network.toLowerCase()