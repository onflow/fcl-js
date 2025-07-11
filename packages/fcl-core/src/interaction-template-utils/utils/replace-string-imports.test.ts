import {replaceStringImports} from "./replace-string-imports"

describe("Verify replace imports works ", () => {
  test("replace single import", async () => {
    const cadence = await replaceStringImports({
      cadence: 'import "FungibleToken"\n\n',
      networkDependencies: {
        FungibleToken: "0xf233dcee88fe0abe",
      },
    })
    expect(cadence).toEqual("import FungibleToken from 0xf233dcee88fe0abe\n\n")
  })

  test("replace multiple import", async () => {
    const cadence = await replaceStringImports({
      cadence: 'import "FungibleToken"\nimport "NonFungibleToken"\n\n',
      networkDependencies: {
        FungibleToken: "0xf233dcee88fe0abe",
        NonFungibleToken: "0x1d7e57aa55817448",
      },
    })

    expect(cadence).toEqual(
      "import FungibleToken from 0xf233dcee88fe0abe\nimport NonFungibleToken from 0x1d7e57aa55817448\n\n"
    )
  })
})
