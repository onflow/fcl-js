import {findImports} from "./find-imports.js"
import {generateImport} from "./generate-import.js"

describe("Find imports", () => {
  const cadenceA = `
        import ContractA from 0xABC123
        import ContractB from 0xDEF456

        pub fun main(): Int {
            return 12
        }
    `

  const cadenceB = `
        import ContractA from 0xABC123
        import ContractB from 0xDEF456
        import Crypto

        pub fun main(): Int {
            return 12
        }
    `

  test("It parses contracts correctly for cadence A", async () => {
    let imports = findImports(cadenceA)

    expect(imports).toEqual([
      generateImport({
        contractName: "ContractA",
        address: "0xABC123",
      }),
      generateImport({
        contractName: "ContractB",
        address: "0xDEF456",
      }),
    ])
  })

  test("It parses contracts correctly for cadence B", async () => {
    let imports = findImports(cadenceA)

    expect(imports).toEqual([
      generateImport({
        contractName: "ContractA",
        address: "0xABC123",
      }),
      generateImport({
        contractName: "ContractB",
        address: "0xDEF456",
      }),
    ])
  })
})
