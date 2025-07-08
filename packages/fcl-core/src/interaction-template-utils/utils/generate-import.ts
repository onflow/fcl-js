import {ImportItem} from "../interaction-template"

export interface GenerateImportParams {
  contractName: string
  address: string
}

/**
 * @description Creates an ImportItem object from a contract name and address. This is a utility
 * function used to generate standardized import objects for interaction templates and dependency
 * management. The contract field is initialized as an empty string.
 *
 * @param params The parameters object containing contract details
 * @param params.contractName The name of the contract being imported
 * @param params.address The Flow address where the contract is deployed
 * @returns ImportItem object with contractName, address, and empty contract field
 *
 * @example
 * // Generate import for FlowToken contract
 * const importItem = generateImport({
 *   contractName: "FlowToken",
 *   address: "0x1654653399040a61"
 * })
 * console.log(importItem)
 * // { contractName: "FlowToken", address: "0x1654653399040a61", contract: "" }
 */
export function generateImport({
  contractName,
  address,
}: GenerateImportParams): ImportItem {
  return {contractName, address, contract: ""}
}
