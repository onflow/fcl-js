import {findImports} from "./find-imports.js"
import {generateImport} from "./generate-import.js"

describe("Find imports", () => {
  const cadenceA = `
        import ContractA from 0xABC123
        import ContractB from 0xDEF456

        access(all) fun main(): Int {
            return 12
        }
    `

  const cadenceB = `
        import ContractA from 0xABC123
        import ContractB from 0xDEF456
        import Crypto

        access(all) fun main(): Int {
            return 12
        }
    `

  const cadenceC = `
    // Go Flow!
    import Crypto
    import ContractA, ContractB, ContractD from 0xABC123
    import ContractC from 0xDEF456
    import Crypto

    access(all) fun main(): Int {
        return 12
    }
`

  test("It parses contracts correctly for cadence A", async () => {
    const imports = findImports(cadenceA)

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
    const imports = findImports(cadenceA)

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

  test("It parses contracts correctly for cadence C", async () => {
    const imports = findImports(cadenceC)

    expect(imports).toEqual([
      generateImport({
        contractName: "ContractA",
        address: "0xABC123",
      }),
      generateImport({
        contractName: "ContractB",
        address: "0xABC123",
      }),
      generateImport({
        contractName: "ContractD",
        address: "0xABC123",
      }),
      generateImport({
        contractName: "ContractC",
        address: "0xDEF456",
      }),
    ])
  })
})
