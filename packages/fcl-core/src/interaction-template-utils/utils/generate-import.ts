import {ImportItem} from "../interaction-template"

export interface GenerateImportParams {
  contractName: string
  address: string
}

export function generateImport({
  contractName,
  address,
}: GenerateImportParams): ImportItem {
  return {contractName, address, contract: ""}
}
