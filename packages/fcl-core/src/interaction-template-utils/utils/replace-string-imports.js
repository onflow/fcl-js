/**
 * @description - Replaces string imports with the actual contract address
 *
 * @param {object} param
 * @param {string} param.cadence
 * @param {object} param.networkDependencies
 * @returns {string} - Cadence
 */
export function replaceStringImports({cadence, networkDependencies}) {
  return Object.keys(networkDependencies).reduce((c, contractName) => {
    const address = networkDependencies[contractName]
    const regex = new RegExp(`import "\\b${contractName}\\b"`, "g")
    return c.replace(regex, `import ${contractName} from ${address}`)
  }, cadence)
}
