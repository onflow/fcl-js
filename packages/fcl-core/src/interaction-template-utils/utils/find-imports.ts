import {generateImport} from "./generate-import"
import {ImportItem} from "../interaction-template"

/**
 * @description Parses a Cadence script or transaction to find all import statements and extracts
 * the contract names and addresses. This function uses regular expressions to identify import
 * statements and creates ImportItem objects for each imported contract.
 *
 * @param cadence The Cadence code string to parse for import statements
 * @returns Array of ImportItem objects containing contract names and addresses
 *
 * @example
 * // Parse imports from Cadence code
 * const cadenceCode = `
 *   import FlowToken from 0x1654653399040a61
 *   import FungibleToken, NonFungibleToken from 0x9a0766d93b6608b7
 *
 *   transaction() {
 *     // transaction code
 *   }
 * `
 *
 * const imports = findImports(cadenceCode)
 * console.log(imports)
 * // [
 * //   { contractName: "FlowToken", address: "0x1654653399040a61", contract: "" },
 * //   { contractName: "FungibleToken", address: "0x9a0766d93b6608b7", contract: "" },
 * //   { contractName: "NonFungibleToken", address: "0x9a0766d93b6608b7", contract: "" }
 * // ]
 */
export function findImports(cadence: string): ImportItem[] {
  const imports: ImportItem[] = []

  const importsReg = /import ((\w|,| )+)* from 0x\w+/g
  const fileImports = cadence.match(importsReg) || []

  for (const fileImport of fileImports) {
    const importLineReg = /import ((\w+|, |)*) from (0x\w+)/g
    const importLine = importLineReg.exec(fileImport)

    const contractsReg = /((?:\w+)+),?/g
    const contracts = importLine?.[1].match(contractsReg) || []

    for (const contract of contracts) {
      imports.push(
        generateImport({
          address: importLine?.[3]!,
          contractName: contract.replace(/,/g, ""),
        })
      )
    }
  }

  return imports
}
