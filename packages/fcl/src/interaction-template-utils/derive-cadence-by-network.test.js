import {deriveCadenceByNetwork} from "./derive-cadence-by-network.js"

describe("Derive cadence by network", () => {
  let template = {
    f_type: "InteractionTemplate",
    f_vsn: "1.0.0",
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
    let cadence = deriveCadenceByNetwork({
      network: "mainnet",
      template,
    })

    expect(cadence).toEqual("import FungibleToken from 0xf233dcee88fe0abe\n")
  })

  test("It fails to derive cadence for unknown network", async () => {
    expect(() =>
      deriveCadenceByNetwork({
        network: "randomnet",
        template,
      })
    ).toThrow(Error)
  })
})
