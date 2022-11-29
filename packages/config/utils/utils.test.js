import {getContracts, anyHasPrivateKeys} from "./utils"

describe("getContracts", () => {
  test("it should gather contract aliases for flow.json", () => {
    const flowJSON = {
      "networks": {
        "emulator": "127.0.0.1:3569",
        "mainnet": "access.mainnet.nodes.onflow.org:9000",
        "testnet": "access.devnet.nodes.onflow.org:9000"
      },
      "contracts": {
        "HelloWorld": {
          "source": "./cadence/contracts/HelloWorld.cdc",
          "aliases": {
            "emulator": "0x123",
            "testnet": "0x124",
            "mainnet": "0x125"
          }
        },
        "FooBar": {
          "source": "./cadence/contracts/FooBar.cdc",
          "aliases": {
            "emulator": "0x223",
            "testnet": "0x224",
            "mainnet": "0x225"
          }
        }
      },
      "accounts": {
        "emulator-account": {
          "address": "f8d6e0586b0a20c7",
          "key": "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646"
        }
      },
      "deployments": {
        "emulator": {
          "emulator-account": ["HelloWorld"]
        }
      }
    }

    const emulatorMappings = {
      "HelloWorld": "0x123",
      "FooBar": "0x223"
    }

    const testnetMappings = {
      "HelloWorld": "0x124",
      "FooBar": "0x224"
    }

    const mainnetMappings = {
      "HelloWorld": "0x125",
      "FooBar": "0x225"
    }

    expect(getContracts(flowJSON, "emulator")).toEqual(emulatorMappings)
    expect(getContracts(flowJSON, "testnet")).toEqual(testnetMappings)
    expect(getContracts(flowJSON, "mainnet")).toEqual(mainnetMappings)

    // Also takes array
    expect(getContracts([flowJSON], "emulator")).toEqual(emulatorMappings)
    expect(getContracts([flowJSON], "testnet")).toEqual(testnetMappings)
    expect(getContracts([flowJSON], "mainnet")).toEqual(mainnetMappings)
  })
})

describe("anyHasPrivateKeys", () => {
  test("it should return true if private keys exist in account", () => {
    const flowJSON = {
      "accounts": {
        "emulator-account": {
          "address": "f8d6e0586b0a20c7",
          "key": "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646"
        }
      }
    }

    const flowJSONTwo = {
      "accounts": {
        "testnet-account": {
          "address": "f8d6e0586b0a20c7",
          "key": "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646"
        }
      }
    }

    const flowJSONThree = {
      "accounts": {
        "emulator-account": {
          "address": "f8d6e0586b0a20c7"
        }
      }
    }

    expect(anyHasPrivateKeys(flowJSON)).toBe(true)
    expect(anyHasPrivateKeys([flowJSON, flowJSONTwo])).toBe(true)
    expect(anyHasPrivateKeys([flowJSON, flowJSONTwo, flowJSONThree])).toBe(true)
  })

  test("it should return false if no private keys exist in account", () => {
    const flowJSON = {
      "accounts": {
        "emulator-account": {
          "address": "f8d6e0586b0a20c7"
        }
      }
    }

    const flowJSONTwo = {
      "accounts": {
        "emulator-account": {
          "address": "f8d6e0586b0a20c7"
        }
      }
    }

    expect(anyHasPrivateKeys(flowJSON)).toBe(false)
    expect(anyHasPrivateKeys([flowJSON, flowJSONTwo])).toBe(false)
  })
})