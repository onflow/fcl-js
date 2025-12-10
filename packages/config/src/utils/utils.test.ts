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

  test("it should handle fork networks that inherit from parent network", () => {
    const flowJSON: FlowJson = {
      networks: {
        emulator: "127.0.0.1:3569",
        mainnet: "access.mainnet.nodes.onflow.org:9000",
        "mainnet-fork": {
          host: "127.0.0.1:3569",
          fork: "mainnet",
        },
      },
      contracts: {
        FlowToken: {
          source: "./contracts/FlowToken.cdc",
          aliases: {
            emulator: "0x0ae53cb6e3f42a79",
            mainnet: "0x1654653399040a61",
          },
        },
        FungibleToken: {
          source: "./contracts/FungibleToken.cdc",
          aliases: {
            emulator: "0xee82856bf20e2aa6",
            mainnet: "0xf233dcee88fe0abe",
          },
        },
      },
    }

    // Fork network should inherit mainnet aliases
    const mainnetForkMappings = {
      FlowToken: "0x1654653399040a61",
      FungibleToken: "0xf233dcee88fe0abe",
    }

    expect(getContracts(flowJSON, "mainnet-fork")).toEqual(mainnetForkMappings)

    // Regular mainnet should still work
    expect(getContracts(flowJSON, "mainnet")).toEqual(mainnetForkMappings)
  })

  test("it should handle testnet fork networks", () => {
    const flowJSON: FlowJson = {
      networks: {
        testnet: "access.devnet.nodes.onflow.org:9000",
        "testnet-fork": {
          host: "127.0.0.1:3569",
          fork: "testnet",
        },
      },
      dependencies: {
        USDC: {
          source: "testnet://a983fecbed621163.USDC",
          hash: "abc123",
          aliases: {
            testnet: "0xa983fecbed621163",
          },
        },
      },
    }

    const testnetForkMappings = {
      USDC: "0xa983fecbed621163",
    }

    expect(getContracts(flowJSON, "testnet-fork")).toEqual(testnetForkMappings)
  })

  test("it should handle fork networks with explicit deployments", () => {
    const flowJSON: FlowJson = {
      networks: {
        mainnet: "access.mainnet.nodes.onflow.org:9000",
        "mainnet-fork": {
          host: "127.0.0.1:3569",
          fork: "mainnet",
        },
      },
      contracts: {
        FlowToken: {
          source: "./contracts/FlowToken.cdc",
          aliases: {
            mainnet: "0x1654653399040a61",
          },
        },
      },
      accounts: {
        "flow-token-mainnet": {
          address: "0x1654653399040a61",
        },
      },
      deployments: {
        "mainnet-fork": {
          "flow-token-mainnet": ["FlowToken"],
        },
      },
    }

    // Deployments are explicit - uses mainnet-fork deployment (not inherited)
    const mainnetForkMappings = {
      FlowToken: "0x1654653399040a61",
    }

    expect(getContracts(flowJSON, "mainnet-fork")).toEqual(mainnetForkMappings)
  })

  test("it should use fork-specific aliases over inherited aliases (fallback behavior)", () => {
    const flowJSON: FlowJson = {
      networks: {
        mainnet: "access.mainnet.nodes.onflow.org:9000",
        "mainnet-fork": {
          host: "127.0.0.1:3569",
          fork: "mainnet",
        },
      },
      contracts: {
        FlowToken: {
          source: "./contracts/FlowToken.cdc",
          aliases: {
            mainnet: "0x1654653399040a61",
            "mainnet-fork": "0x0000000000000001", // Override for fork!
          },
        },
        FungibleToken: {
          source: "./contracts/FungibleToken.cdc",
          aliases: {
            mainnet: "0xf233dcee88fe0abe",
            // No mainnet-fork alias - should inherit from mainnet
          },
        },
      },
    }

    const mainnetForkMappings = {
      FlowToken: "0x0000000000000001", // Uses fork-specific alias
      FungibleToken: "0xf233dcee88fe0abe", // Falls back to mainnet alias
    }

    expect(getContracts(flowJSON, "mainnet-fork")).toEqual(mainnetForkMappings)
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
