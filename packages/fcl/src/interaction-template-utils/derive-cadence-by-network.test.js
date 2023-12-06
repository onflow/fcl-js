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

describe("Derive cadence by network 1.1.0 single import", () => {
  let templatev11 = {
    f_type: "InteractionTemplate",
    f_version: "1.1.0",
    id: "a2b2d73def...aabc5472d2",
    data: {
      type: "transaction",
      interface: "asadf23234...fas234234",
      messages: [],
      cadence: {
        body: "import \"FlowToken\"\n        transaction(amount: UFix64, to: Address) {\n            let vault: @FungibleToken.Vault\n            prepare(signer: AuthAccount) {\n                %%self.vault <- signer\n                .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n                .withdraw(amount: amount)\n                self.vault <- FungibleToken.getVault(signer)\n            }\n            execute {\n                getAccount(to)\n                .getCapability(/public/flowTokenReceiver)!\n                .borrow<&{FungibleToken.Receiver}>()!\n                .deposit(from: <-self.vault)\n            }\n        }",
        pins: [
          {
            network: "mainnet",
            pin: "186e262ce6fe06b5075ec6569a0e5482a79c471881182612d8e4a665c2977f3e",
          },
          {
            network: "testnet",
            pin: "f93977d7a297f559e97259cb2a95fed0f87cfeec46c5257a26adc26a260d6c4c",
          },
        ],
      },
      dependencies: [
        {
          contracts: [
            {
              contract: "FlowToken",
              networks: [
                {
                  network: "mainnet",
                  address: "0x1654653399040a61",
                  dependency_pin_block_height: 10123123123,
                  dependency_pin: {
                    pin: "c8cb7cc7a1c2a329de65d83455016bc3a9b53f9668c74ef555032804bac0b25b",
                    pin_self:
                      "38d0cca4b74c4e88213df636b4cfc2eb6e86fd8b2b84579d3b9bffab3e0b1fcb",
                    pin_contract_name: "FlowToken",
                    imports: [
                      {
                        pin: "b8a3ed26c222ed67016a28021d8fee5603b948533cbc992b3c90f71a61b2b312",
                        pin_self:
                          "7bc3056ba5d39d130f45411c2c05bb549db8ce727c11a1cb821136a621be27fb",
                        pin_contract_name: "FungibleToken",
                        pin_contract_address: "0xf233dcee88fe0abe",
                        imports: [],
                      },
                    ],
                  },
                },
                {
                  network: "testnet",
                  address: "0x7e60df042a9c0868",
                  dependency_pin_block_height: 10123123123,
                  dependency_pin: {
                    pin: "c8cb7cc7a1c2a329de65d83455016bc3a9b53f9668c74ef555032804bac0b25b",
                    pin_self:
                      "38d0cca4b74c4e88213df636b4cfc2eb6e86fd8b2b84579d3b9bffab3e0b1fcb",
                    pin_contract_name: "FlowToken",
                    pin_contract_address: "0x7e60df042a9c0868",
                    imports: [],
                  },
                },
              ],
            },
          ],
        },
      ],
      parameters: [
        {
          label: "amount",
          index: 0,
          type: "UFix64",
          messages: [],
          balance: "FlowToken",
        },
        {
          label: "to",
          index: 1,
          type: "Address",
          messages: [],
        },
      ],
    },
  }

  const mainnetAddressReplaced = "import FlowToken from 0x1654653399040a61\n        transaction(amount: UFix64, to: Address) {\n            let vault: @FungibleToken.Vault\n            prepare(signer: AuthAccount) {\n                %%self.vault <- signer\n                .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n                .withdraw(amount: amount)\n                self.vault <- FungibleToken.getVault(signer)\n            }\n            execute {\n                getAccount(to)\n                .getCapability(/public/flowTokenReceiver)!\n                .borrow<&{FungibleToken.Receiver}>()!\n                .deposit(from: <-self.vault)\n            }\n        }"
  test("1.1.0 derives cadence correctly for a given mainnet", async () => {
    let cadence = deriveCadenceByNetwork({
      network: "mainnet",
      template: templatev11,
    })

    expect(cadence).toEqual(mainnetAddressReplaced)

    
  })

  const testnetAddressReplaced = "import FlowToken from 0x7e60df042a9c0868\n        transaction(amount: UFix64, to: Address) {\n            let vault: @FungibleToken.Vault\n            prepare(signer: AuthAccount) {\n                %%self.vault <- signer\n                .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n                .withdraw(amount: amount)\n                self.vault <- FungibleToken.getVault(signer)\n            }\n            execute {\n                getAccount(to)\n                .getCapability(/public/flowTokenReceiver)!\n                .borrow<&{FungibleToken.Receiver}>()!\n                .deposit(from: <-self.vault)\n            }\n        }"
    test("1.1.0 derives cadence correctly for a given testnet", async () => {
      let cadence = deriveCadenceByNetwork({
        network: "testnet",
        template: templatev11,
      })

      expect(cadence).toEqual(testnetAddressReplaced)
    })

    test("It fails to derive cadence for unknown network", async () => {
      expect(() =>
        deriveCadenceByNetwork({
          network: "randomnet",
          templatev11,
        })
      ).toThrow(Error)
    })
})


describe("Derive cadence by network 1.1.0 multiple import", () => {
  let templatev11 = {
    f_type: "InteractionTemplate",
    f_version: "1.1.0",
    id: "a2b2d73def...aabc5472d2",
    data: {
      type: "transaction",
      interface: "asadf23234...fas234234",
      messages: [],
      cadence: {
        body: "import \"FlowToken\"\n import \"FungibleToken\"\n        transaction(amount: UFix64, to: Address) {\n            let vault: @FungibleToken.Vault\n            prepare(signer: AuthAccount) {\n                %%self.vault <- signer\n                .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n                .withdraw(amount: amount)\n                self.vault <- FungibleToken.getVault(signer)\n            }\n            execute {\n                getAccount(to)\n                .getCapability(/public/flowTokenReceiver)!\n                .borrow<&{FungibleToken.Receiver}>()!\n                .deposit(from: <-self.vault)\n            }\n        }",
        pins: [
          {
            network: "mainnet",
            pin: "186e262ce6fe06b5075ec6569a0e5482a79c471881182612d8e4a665c2977f3e",
          },
          {
            network: "testnet",
            pin: "f93977d7a297f559e97259cb2a95fed0f87cfeec46c5257a26adc26a260d6c4c",
          },
        ],
      },
      dependencies: [
        {
          contracts: [
            {
              contract: "FlowToken",
              networks: [
                {
                  network: "mainnet",
                  address: "0x1654653399040a61",
                  dependency_pin_block_height: 10123123123,
                  dependency_pin: {
                    pin: "c8cb7cc7a1c2a329de65d83455016bc3a9b53f9668c74ef555032804bac0b25b",
                    pin_self:
                      "38d0cca4b74c4e88213df636b4cfc2eb6e86fd8b2b84579d3b9bffab3e0b1fcb",
                    pin_contract_name: "FlowToken",
                    imports: [],
                  },
                },
                {
                  network: "testnet",
                  address: "0x7e60df042a9c0868",
                  dependency_pin_block_height: 10123123123,
                  dependency_pin: {
                    pin: "c8cb7cc7a1c2a329de65d83455016bc3a9b53f9668c74ef555032804bac0b25b",
                    pin_self:
                      "38d0cca4b74c4e88213df636b4cfc2eb6e86fd8b2b84579d3b9bffab3e0b1fcb",
                    pin_contract_name: "FlowToken",
                    pin_contract_address: "0x7e60df042a9c0868",
                    imports: [],
                  },
                },
              ],
            },
            {
              contract: "FungibleToken",
              networks: [
                {
                  network: "mainnet",
                  address: "0xf233dcee88fe0abe",
                  dependency_pin_block_height: 10123123123,
                  dependency_pin: {
                    pin: "c8cb7cc7a1c2a329de65d83455016bc3a9b53f9668c74ef555032804bac0b25b",
                    pin_self:
                      "38d0cca4b74c4e88213df636b4cfc2eb6e86fd8b2b84579d3b9bffab3e0b1fcb",
                    pin_contract_name: "FlowToken",
                    imports: [],
                  },
                },
                {
                  network: "testnet",
                  address: "0x11111111111",
                  dependency_pin_block_height: 10123123123,
                  dependency_pin: {
                    pin: "c8cb7cc7a1c2a329de65d83455016bc3a9b53f9668c74ef555032804bac0b25b",
                    pin_self:
                      "38d0cca4b74c4e88213df636b4cfc2eb6e86fd8b2b84579d3b9bffab3e0b1fcb",
                    pin_contract_name: "FlowToken",
                    pin_contract_address: "0x7e60df042a9c0868",
                    imports: [],
                  },
                },
              ],
            },
          ],
        },
      ],
      parameters: [
        {
          label: "amount",
          index: 0,
          type: "UFix64",
          messages: [],
          balance: "FlowToken",
        },
        {
          label: "to",
          index: 1,
          type: "Address",
          messages: [],
        },
      ],
    },
  }

  const mainnetAddressReplaced = "import FlowToken from 0x1654653399040a61\n import FungibleToken from 0xf233dcee88fe0abe\n        transaction(amount: UFix64, to: Address) {\n            let vault: @FungibleToken.Vault\n            prepare(signer: AuthAccount) {\n                %%self.vault <- signer\n                .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n                .withdraw(amount: amount)\n                self.vault <- FungibleToken.getVault(signer)\n            }\n            execute {\n                getAccount(to)\n                .getCapability(/public/flowTokenReceiver)!\n                .borrow<&{FungibleToken.Receiver}>()!\n                .deposit(from: <-self.vault)\n            }\n        }"
  test("1.1.0 multiple imports derives cadence correctly for a given mainnet", async () => {
    let cadence = deriveCadenceByNetwork({
      network: "mainnet",
      template: templatev11,
    })

    expect(cadence).toEqual(mainnetAddressReplaced)

    
  })

  const testnetAddressReplaced = "import FlowToken from 0x7e60df042a9c0868\n import FungibleToken from 0x11111111111\n        transaction(amount: UFix64, to: Address) {\n            let vault: @FungibleToken.Vault\n            prepare(signer: AuthAccount) {\n                %%self.vault <- signer\n                .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n                .withdraw(amount: amount)\n                self.vault <- FungibleToken.getVault(signer)\n            }\n            execute {\n                getAccount(to)\n                .getCapability(/public/flowTokenReceiver)!\n                .borrow<&{FungibleToken.Receiver}>()!\n                .deposit(from: <-self.vault)\n            }\n        }"
    test("1.1.0 multiple imports derives cadence correctly for a given testnet", async () => {
      let cadence = deriveCadenceByNetwork({
        network: "testnet",
        template: templatev11,
      })

      expect(cadence).toEqual(testnetAddressReplaced)
    })

    test("1.1.0 multiple imports fails to derive cadence for unknown network", async () => {
      expect(() =>
        deriveCadenceByNetwork({
          network: "randomnet",
          templatev11,
        })
      ).toThrow(Error)
    })
})