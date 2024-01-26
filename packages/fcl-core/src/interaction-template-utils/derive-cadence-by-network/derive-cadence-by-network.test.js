import {deriveCadenceByNetwork} from "./derive-cadence-by-network.js"

describe("Derive cadence by network 1.0.0", () => {
  let template = {
    f_type: "InteractionTemplate",
    f_version: "1.0.0",
    id: "abc123",
    data: {
      type: "transaction",
      interface: "",
      messages: {},
      cadence: "import FungibleToken from 0xFUNGIBLETOKENADDRESS\n",
      dependencies: {
        "0xFUNGIBLETOKENADDRESS": {
          FungibleToken: {
            mainnet: {
              address: "0xf233dcee88fe0abe",
              fq_address: "A.0xf233dcee88fe0abe.FungibleToken",
              contract: "FungibleToken",
              pin: "83c9e3d61d3b5ebf24356a9f17b5b57b12d6d56547abc73e05f820a0ae7d9cf5",
              pin_block_height: 34166296,
            },
            testnet: {
              address: "0x9a0766d93b6608b7",
              fq_address: "A.0x9a0766d93b6608b7.FungibleToken",
              contract: "FungibleToken",
              pin: "83c9e3d61d3b5ebf24356a9f17b5b57b12d6d56547abc73e05f820a0ae7d9cf5",
              pin_block_height: 74776482,
            },
          },
        },
      },
      arguments: {},
    },
  }

  test("It derives cadence correctly for a given network", async () => {
    let cadence = await deriveCadenceByNetwork({
      network: "mainnet",
      template,
    })

    expect(cadence).toEqual("import FungibleToken from 0xf233dcee88fe0abe\n")
  })

  test("It fails to derive cadence for unknown network", async () => {
    await expect(() =>
      deriveCadenceByNetwork({
        network: "randomnet",
        template,
      })
    ).rejects.toThrow(Error)
  })
})

describe("Derive cadence by network 1.1.0", () => {
  let template = {
    f_type: "InteractionTemplate", // Data Type
    f_version: "1.1.0", // Data Type Version
    id: "a2b2d73def...aabc5472d2", // Unique ID for the data structure.
    data: {
      type: "transaction", // "transaction" || "script"
      interface: "asadf23234...fas234234", // ID of InteractionTemplateInterface this conforms to.
      messages: [],
      // Cadence code this interaction executes.
      cadence: "import FungibleToken from 0xFUNGIBLETOKENADDRESS\n",
      dependencies: [
        {
          placeholder: "0xFUNGIBLETOKENADDRESS", // Network (mainnet || testnet) dependent locations for 0xFUNGIBLETOKENADDRESS contract.
          contracts: [
            {
              contract: "FungibleToken",
              networks: [
                {
                  network: "mainnet",
                  address: "0xf233dcee88fe0abe", // Address of the account the contract is located.
                  fq_address: "A.0xf233dcee88fe0abe.FungibleToken", // Fully qualified contract identifier.
                  pin: "asdfasdfasdfasdfasdfasdfsadf123123123123", // Unique identifier of the interactions dependency tree.
                  pin_block_height: 10123123123, // Block height the pin was generated against.
                },
                {
                  network: "testnet",
                  address: "0x9a0766d93b6608b7",
                  fq_address: "A.0x9a0766d93b6608b7.FungibleToken",
                  pin: "asdfasdfasdfasdfasdfasdfsadf123123123123",
                  pin_block_height: 10123123123,
                },
              ],
            },
          ],
        },
      ],
      arguments: [],
    },
  }

  test("It derives cadence correctly for a given network", async () => {
    let cadence = await deriveCadenceByNetwork({
      network: "mainnet",
      template,
    })

    expect(cadence).toEqual("import FungibleToken from 0xf233dcee88fe0abe\n")
  })

  test("It fails to derive cadence for unknown network", async () => {
    await expect(() =>
      deriveCadenceByNetwork({
        network: "randomnet",
        template,
      })
    ).rejects.toThrow(Error)
  })
})
