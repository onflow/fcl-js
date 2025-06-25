export interface ReplaceStringImportsParams {
  cadence: string
  networkDependencies: Record<string, string>
}

/**
 * @description Replaces string imports with the actual contract address
 *
 * @param params
 * @param params.cadence The Cadence code
 * @param params.networkDependencies Network dependencies mapping
 * @returns Cadence code with replaced imports
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
