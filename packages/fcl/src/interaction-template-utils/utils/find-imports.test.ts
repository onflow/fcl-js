import {findImports} from "./find-imports"
import {generateImport} from "./generate-import"

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

  const cadenceC = `
    // Go Flow!
    import Crypto
    import ContractA, ContractB, ContractD from 0xABC123
    import ContractC from 0xDEF456
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

  test("It parses contracts correctly for cadence C", async () => {
    let imports = findImports(cadenceC)

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
