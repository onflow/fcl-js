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
 * @param {...Object[]} sources
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
 * @param {Object|Object[]} obj
 * @returns {Object}
 */
const filterContracts = obj => obj.contracts ? obj.contracts : {}

/**
 * Gathers contract addresses by network
 * @param {string} network emulator, testnet, mainnet
 * @returns {Object} { "HelloWorld": "0x123" }
 */
const mapContractToNetworkAddress = network => contracts => {
  return Object.entries(contracts).reduce((c, [key, value]) => {
    const networkContractAlias = value?.aliases?.[network]
    if (networkContractAlias) {
      c[key] = networkContractAlias
    }

    return c
  }, {})
}

/**
 * Take in flow.json files and return contract to address mapping by network
 * @param {Object|Object[]} jsons
 * @param {string} network emulator, testnet, mainnet
 * @returns {Object} { "HelloWorld": "0x123" }
 */
export const getContracts = (jsons, network) => {
  return pipe(
    mergeFlowJSONs,
    filterContracts,
    mapContractToNetworkAddress(network)
  )(jsons)
}

/**
 * Checks flow.json file for private keys
 * @param {Object} flowJSON
 * @returns {boolean}
 */
const hasPrivateKeys = flowJSON => {
  return Object.entries(flowJSON?.accounts).reduce((hasPrivateKey, [key, value]) => {
    if (hasPrivateKey) return true
    return value?.hasOwnProperty("key")
  }, false)
}

/**
 * Take in flow.json or array of flow.json files and checks for private keys
 * @param {Object|Object[]} value
 * @returns {boolean}
 */
export const anyHasPrivateKeys = value => {
  if (isObject(value)) return hasPrivateKeys(value)
  return value.some(hasPrivateKeys)
}

/**
 * Format network to always be 'emulator', 'testnet', or 'mainnet'
 * @param {string} network 'local', 'emulator', 'testnet', 'mainnet'
 * @returns {string} 'emulator', 'testnet', 'mainnet'
 */
export const cleanNetwork = network => network?.toLowerCase() === 'local' ? 'emulator' : network?.toLowerCase()