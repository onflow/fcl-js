import {generateImport} from "./generate-import"
import {ImportItem} from "../interaction-template"

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
