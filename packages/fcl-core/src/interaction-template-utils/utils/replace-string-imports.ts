export interface ReplaceStringImportsParams {
  cadence: string
  networkDependencies: Record<string, string>
}

/**
 * @description Replaces string imports with the actual contract address
 *
 * @param {ReplaceStringImportsParams} param
 * @param {string} param.cadence The Cadence code
 * @param {object} param.networkDependencies Network dependencies mapping
 * @returns {string} Cadence code with replaced imports
 */
export function replaceStringImports({
  cadence,
  networkDependencies,
}: ReplaceStringImportsParams): string {
  return Object.keys(networkDependencies).reduce((c, contractName) => {
    const address = networkDependencies[contractName]
    const regex = new RegExp(`import "\\b${contractName}\\b"`, "g")
    return c.replace(regex, `import ${contractName} from ${address}`)
  }, cadence)
}
