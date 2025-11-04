import {getContracts, anyHasPrivateKeys, FlowJson} from "./utils"

describe("getContracts", () => {
  test("it should gather contract aliases for flow.json", () => {
    const flowJSON: FlowJson = {
      networks: {
        emulator: "127.0.0.1:3569",
        mainnet: "access.mainnet.nodes.onflow.org:9000",
        testnet: "access.devnet.nodes.onflow.org:9000",
      },
      contracts: {
        HelloWorld: {
          source: "./cadence/contracts/HelloWorld.cdc",
          aliases: {
            emulator: "0x123",
            testnet: "0x124",
            mainnet: "0x125",
          },
        },
        FooBar: {
          source: "./cadence/contracts/FooBar.cdc",
          aliases: {
            emulator: "0x223",
            testnet: "0x224",
            mainnet: "0x225",
          },
        },
      },
      dependencies: {
        FungibleToken: {
          source: "emulator://123.FungibleToken",
          hash: "123",
          aliases: {
            emulator: "0x333",
            testnet: "0x222",
            mainnet: "0x111",
          },
        },
      },
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
          key: "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646",
        },
      },
      deployments: {
        emulator: {
          "emulator-account": ["HelloWorld"],
        },
      },
    }

    const emulatorMappings = {
      HelloWorld: "0x123",
      FooBar: "0x223",
      FungibleToken: "0x333",
    }

    const testnetMappings = {
      HelloWorld: "0x124",
      FooBar: "0x224",
      FungibleToken: "0x222",
    }

    const mainnetMappings = {
      HelloWorld: "0x125",
      FooBar: "0x225",
      FungibleToken: "0x111",
    }

    expect(getContracts(flowJSON, "emulator")).toEqual(emulatorMappings)
    expect(getContracts(flowJSON, "testnet")).toEqual(testnetMappings)
    expect(getContracts(flowJSON, "mainnet")).toEqual(mainnetMappings)

    // Also takes array
    expect(getContracts([flowJSON], "emulator")).toEqual(emulatorMappings)
    expect(getContracts([flowJSON], "testnet")).toEqual(testnetMappings)
    expect(getContracts([flowJSON], "mainnet")).toEqual(mainnetMappings)
  })

  test("it should handle multiple contracts in deployments section", () => {
    const flowJSON: FlowJson = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
        },
        "testnet-account": {
          address: "a470920a30c770a5",
        },
      },
      deployments: {
        emulator: {
          "emulator-account": ["ContractA", "ContractB", "ContractC"],
        },
        testnet: {
          "testnet-account": ["ContractA", "ContractB"],
        },
      },
    }

    const emulatorMappings = {
      ContractA: "f8d6e0586b0a20c7",
      ContractB: "f8d6e0586b0a20c7",
      ContractC: "f8d6e0586b0a20c7",
    }

    const testnetMappings = {
      ContractA: "a470920a30c770a5",
      ContractB: "a470920a30c770a5",
    }

    expect(getContracts(flowJSON, "emulator")).toEqual(emulatorMappings)
    expect(getContracts(flowJSON, "testnet")).toEqual(testnetMappings)
  })

  test("it should merge deployments with contract aliases", () => {
    const flowJSON: FlowJson = {
      contracts: {
        HelloWorld: {
          source: "./cadence/contracts/HelloWorld.cdc",
          aliases: {
            emulator: "0x123",
          },
        },
      },
      accounts: {
        "emulator-account": {
          address: "0xf8d6e0586b0a20c7",
        },
      },
      deployments: {
        emulator: {
          "emulator-account": ["DeployedContract"],
        },
      },
    }

    const emulatorMappings = {
      HelloWorld: "0x123",
      DeployedContract: "0xf8d6e0586b0a20c7",
    }

    expect(getContracts(flowJSON, "emulator")).toEqual(emulatorMappings)
  })

  test("it should handle multiple accounts with multiple contracts each", () => {
    const flowJSON: FlowJson = {
      accounts: {
        "account-1": {
          address: "0x01",
        },
        "account-2": {
          address: "0x02",
        },
      },
      deployments: {
        emulator: {
          "account-1": ["Contract1A", "Contract1B"],
          "account-2": ["Contract2A", "Contract2B"],
        },
      },
    }

    const emulatorMappings = {
      Contract1A: "0x01",
      Contract1B: "0x01",
      Contract2A: "0x02",
      Contract2B: "0x02",
    }

    expect(getContracts(flowJSON, "emulator")).toEqual(emulatorMappings)
  })
})

describe("anyHasPrivateKeys", () => {
  test("it should return true if private keys exist in account", () => {
    const flowJSON = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
          key: "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646",
        },
      },
    }

    const flowJSONTwo = {
      accounts: {
        "testnet-account": {
          address: "f8d6e0586b0a20c7",
          key: "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646",
        },
      },
    }

    const flowJSONThree = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
        },
      },
    }

    expect(anyHasPrivateKeys(flowJSON)).toBe(true)
    expect(anyHasPrivateKeys([flowJSON, flowJSONTwo])).toBe(true)
    expect(anyHasPrivateKeys([flowJSON, flowJSONTwo, flowJSONThree])).toBe(true)
  })

  test("should return false for environmental variables", async () => {
    const flowJSON = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
          key: "$FLOW_EMULATOR_PRIVATE_KEY",
        },
      },
    }

    expect(anyHasPrivateKeys(flowJSON)).toBe(false)
  })

  test("it should return false if no private keys exist in account", () => {
    const flowJSON = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
        },
      },
    }

    const flowJSONTwo = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
        },
      },
    }

    expect(anyHasPrivateKeys(flowJSON)).toBe(false)
    expect(anyHasPrivateKeys([flowJSON, flowJSONTwo])).toBe(false)
  })

  test("it should return false if private key value is in separate file", () => {
    const flowJSON = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
          key: {
            type: "file",
            location: "./emulator.key",
          },
        },
      },
    }

    const flowJSONTwo = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
        },
      },
    }

    const flowJSONThree = {
      accounts: {
        "emulator-account": {
          address: "f8d6e0586b0a20c7",
          key: "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646",
        },
      },
    }

    expect(anyHasPrivateKeys(flowJSON)).toBe(false)
    expect(anyHasPrivateKeys([flowJSON, flowJSONTwo])).toBe(false)
    expect(anyHasPrivateKeys(flowJSONThree)).toBe(true)
  })
})
