import {generateTemplateId} from "./generate-template-id.js"
import {replaceStringImports} from "../utils/replace-string-imports.js"
import {genHash} from "../utils/hash.js"

const returnedAccount = {
  address: "0xf233dcee88fe0abe",
  keys: [],
  balance: "10",
  contracts: {
    FungibleToken: `/**

# The Flow Fungible Token standard

## \`FungibleToken\` contract interface

The interface that all Fungible Token contracts would have to conform to.
If a users wants to deploy a new token contract, their contract
would need to implement the FungibleToken interface.

Their contract would have to follow all the rules and naming
that the interface specifies.

## \`Vault\` resource

Each account that owns tokens would need to have an instance
of the Vault resource stored in their account storage.

The Vault resource has methods that the owner and other users can call.

## \`Provider\`, \`Receiver\`, and \`Balance\` resource interfaces

These interfaces declare pre-conditions and post-conditions that restrict
the execution of the functions in the Vault.

They are separate because it gives the user the ability to share
a reference to their Vault that only exposes the fields functions
in one or more of the interfaces.

It also gives users the ability to make custom resources that implement
these interfaces to do various things with the tokens.
For example, a faucet can be implemented by conforming
to the Provider interface.

By using resources and interfaces, users of Fungible Token contracts
can send and receive tokens peer-to-peer, without having to interact
with a central ledger smart contract. To send tokens to another user,
a user would simply withdraw the tokens from their Vault, then call
the deposit function on another user's Vault to complete the transfer.

*/

/// The interface that Fungible Token contracts implement.
///
pub contract interface FungibleToken {

    /// The total number of tokens in existence.
    /// It is up to the implementer to ensure that the total supply
    /// stays accurate and up to date
    pub var totalSupply: UFix64

    /// The event that is emitted when the contract is created
    pub event TokensInitialized(initialSupply: UFix64)

    /// The event that is emitted when tokens are withdrawn from a Vault
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    /// The event that is emitted when tokens are deposited into a Vault
    pub event TokensDeposited(amount: UFix64, to: Address?)

    /// The interface that enforces the requirements for withdrawing
    /// tokens from the implementing type.
    ///
    /// It does not enforce requirements on \`balance\` here,
    /// because it leaves open the possibility of creating custom providers
    /// that do not necessarily need their own balance.
    ///
    pub resource interface Provider {

        /// Subtracts tokens from the owner's Vault
        /// and returns a Vault with the removed tokens.
        ///
        /// The function's access level is public, but this is not a problem
        /// because only the owner storing the resource in their account
        /// can initially call this function.
        ///
        /// The owner may grant other accounts access by creating a private
        /// capability that allows specific other users to access
        /// the provider resource through a reference.
        ///
        /// The owner may also grant all accounts access by creating a public
        /// capability that allows all users to access the provider
        /// resource through a reference.
        ///
        /// @param amount: The amount of tokens to be withdrawn from the vault
        /// @return The Vault resource containing the withdrawn funds
        /// 
        pub fun withdraw(amount: UFix64): @Vault {
            post {
                // \`result\` refers to the return value
                result.balance == amount:
                    "Withdrawal amount must be the same as the balance of the withdrawn Vault"
            }
        }
    }

    /// The interface that enforces the requirements for depositing
    /// tokens into the implementing type.
    ///
    /// We do not include a condition that checks the balance because
    /// we want to give users the ability to make custom receivers that
    /// can do custom things with the tokens, like split them up and
    /// send them to different places.
    ///
    pub resource interface Receiver {

        /// Takes a Vault and deposits it into the implementing resource type
        ///
        /// @param from: The Vault resource containing the funds that will be deposited
        ///
        pub fun deposit(from: @Vault)

        /// Below is referenced from the FLIP #69 https://github.com/onflow/flips/blob/main/flips/20230206-fungible-token-vault-type-discovery.md
        /// 
        /// Returns the dictionary of Vault types that the the receiver is able to accept in its \`deposit\` method
        /// this then it would return \`{Type<@FlowToken.Vault>(): true}\` and if any custom receiver
        /// uses the default implementation then it would return empty dictionary as its parent
        /// resource doesn't conform with the \`FungibleToken.Vault\` resource.
        ///
        /// Custom receiver implementations are expected to upgrade their contracts to add an implementation
        /// that supports this method because it is very valuable for various applications to have.
        ///
        /// @return dictionary of supported deposit vault types by the implementing resource.
        /// 
        pub fun getSupportedVaultTypes(): {Type: Bool} {
            // Below check is implemented to make sure that run-time type would
            // only get returned when the parent resource conforms with \`FungibleToken.Vault\`. 
            if self.getType().isSubtype(of: Type<@FungibleToken.Vault>()) {
                return {self.getType(): true}
            } else {
                // Return an empty dictionary as the default value for resource who don't
                // implement \`FungibleToken.Vault\`, such as \`FungibleTokenSwitchboard\`, \`TokenForwarder\` etc.
                return {}
            }
        }
    }

    /// The interface that contains the \`balance\` field of the Vault
    /// and enforces that when new Vaults are created, the balance
    /// is initialized correctly.
    ///
    pub resource interface Balance {

        /// The total balance of a vault
        ///
        pub var balance: UFix64

        init(balance: UFix64) {
            post {
                self.balance == balance:
                    "Balance must be initialized to the initial balance"
            }
        }

        /// Function that returns all the Metadata Views implemented by a Fungible Token
        ///
        /// @return An array of Types defining the implemented views. This value will be used by
        ///         developers to know which parameter to pass to the resolveView() method.
        ///
        pub fun getViews(): [Type] {
            return []
        }

        /// Function that resolves a metadata view for this fungible token by type.
        ///
        /// @param view: The Type of the desired view.
        /// @return A structure representing the requested view.
        ///
        pub fun resolveView(_ view: Type): AnyStruct? {
            return nil
        }
    }

    /// The resource that contains the functions to send and receive tokens.
    /// The declaration of a concrete type in a contract interface means that
    /// every Fungible Token contract that implements the FungibleToken interface
    /// must define a concrete \`Vault\` resource that conforms to the \`Provider\`, \`Receiver\`,
    /// and \`Balance\` interfaces, and declares their required fields and functions
    ///
    pub resource Vault: Provider, Receiver, Balance {

        /// The total balance of the vault
        pub var balance: UFix64

        // The conforming type must declare an initializer
        // that allows providing the initial balance of the Vault
        //
        init(balance: UFix64)

        /// Subtracts \`amount\` from the Vault's balance
        /// and returns a new Vault with the subtracted balance
        ///
        /// @param amount: The amount of tokens to be withdrawn from the vault
        /// @return The Vault resource containing the withdrawn funds
        ///
        pub fun withdraw(amount: UFix64): @Vault {
            pre {
                self.balance >= amount:
                    "Amount withdrawn must be less than or equal than the balance of the Vault"
            }
            post {
                // use the special function \`before\` to get the value of the \`balance\` field
                // at the beginning of the function execution
                //
                self.balance == before(self.balance) - amount:
                    "New Vault balance must be the difference of the previous balance and the withdrawn Vault"
            }
        }

        /// Takes a Vault and deposits it into the implementing resource type
        ///
        /// @param from: The Vault resource containing the funds that will be deposited
        ///
        pub fun deposit(from: @Vault) {
            // Assert that the concrete type of the deposited vault is the same
            // as the vault that is accepting the deposit
            pre {
                from.isInstance(self.getType()): 
                    "Cannot deposit an incompatible token type"
            }
            post {
                self.balance == before(self.balance) + before(from.balance):
                    "New Vault balance must be the sum of the previous balance and the deposited Vault"
            }
        }
    }

    /// Allows any user to create a new Vault that has a zero balance
    ///
    /// @return The new Vault resource
    ///
    pub fun createEmptyVault(): @Vault {
        post {
            result.balance == 0.0: "The newly created Vault must have zero balance"
        }
    }
}
`,
  },
  code: null,
}

jest.mock("@onflow/sdk", () => ({
  send: jest.fn().mockImplementation(({}) => {
    // Adjusted mock implementation
    const sanitized = returnedAccount.contracts.FungibleToken.replace(/\\/g, "")
    returnedAccount.contracts.FungibleToken = sanitized
    return Promise.resolve(returnedAccount)
  }),
  getAccount: jest.fn().mockImplementation(({}) => {
    // Adjusted mock implementation
    return Promise.resolve({data: returnedAccount})
  }),
  invariant: jest.fn().mockImplementation(({}) => {
    // Adjusted mock implementation
    return
  }),
  config: jest.fn().mockImplementation(() => {
    // Adjusted mock implementation
    return {
      get: jest.fn().mockImplementation(() => {
        // Adjusted mock implementation
        return Promise.resolve("0xf233dcee88fe0abe")
      }),
    }
  }),
  atBlockHeight: jest.fn().mockImplementation(({}) => {
    // Adjusted mock implementation
    return Promise.resolve({})
  }),
}))

describe("Gen template id interaction template messages 1.1.0", () => {
  const template = {
    f_type: "InteractionTemplate",
    f_version: "1.1.0",
    id: "3accd8c0bf4c7b543a80287d6c158043b4c2e737c2205dba6e009abbbf1328a4",
    data: {
      type: "transaction",
      interface: "",
      messages: [
        {
          key: "title",
          i18n: [
            {
              tag: "en-US",
              translation: "Transfer Tokens",
            },
          ],
        },
        {
          key: "description",
          i18n: [
            {
              tag: "en-US",
              translation: "Transfer Flow to account",
            },
          ],
        },
      ],
      cadence: {
        body: 'import "FungibleToken"\n\n#interaction(\n    version: "1.1.0",\n    title: "Transfer Flow",\n    description: "Transfer Flow to account",\n    language: "en-US",\n    parameters: [\n        Parameter(\n            name: "amount", \n            title: "Amount", \n            description: "The amount of FLOW tokens to send"\n        ),\n        Parameter(\n            name: "to", \n            title: "To",\n            description: "The Flow account the tokens will go to"\n        )\n    ],\n)\n\ntransaction(amount: UFix64, to: Address) {\n    let vault: @FungibleToken.Vault\n    \n    prepare(signer: AuthAccount) {\n        self.vault \u003c- signer\n            .borrow\u003c\u0026{FungibleToken.Provider}\u003e(from: /storage/flowTokenVault)!\n            .withdraw(amount: amount)\n    }\n\n    execute {\n        getAccount(to)\n            .getCapability(/public/flowTokenReceiver)!\n            .borrow\u003c\u0026{FungibleToken.Receiver}\u003e()!\n            .deposit(from: \u003c-self.vault)\n    }\n}',
        network_pins: [
          {
            network: "mainnet",
            pin_self:
              "dd046de8ef442e4d708124d5710cb78962eb884a4387df1f0b1daf374bd28278",
          },
          {
            network: "testnet",
            pin_self:
              "4089786f5e19fe66b39e347634ca28229851f4de1fd469bd8f327d79510e771f",
          },
        ],
      },
      dependencies: [
        {
          contracts: [
            {
              contract: "FungibleToken",
              networks: [
                {
                  network: "mainnet",
                  address: "0xf233dcee88fe0abe",
                  dependency_pin_block_height: 70493190,
                  dependency_pin: {
                    pin: "ac0208f93d07829ec96584d618ddbec6af3cf4e2866bd5071249e8ec93c7e0dc",
                    pin_self:
                      "cdadd5b5897f2dfe35d8b25f4e41fea9f8fca8f40f8a8b506b33701ef5033076",
                    pin_contract_name: "FungibleToken",
                    pin_contract_address: "0xf233dcee88fe0abe",
                    imports: [],
                  },
                },
                {
                  network: "testnet",
                  address: "0x9a0766d93b6608b7",
                  dependency_pin_block_height: 149595558,
                  dependency_pin: {
                    pin: "ac0208f93d07829ec96584d618ddbec6af3cf4e2866bd5071249e8ec93c7e0dc",
                    pin_self:
                      "cdadd5b5897f2dfe35d8b25f4e41fea9f8fca8f40f8a8b506b33701ef5033076",
                    pin_contract_name: "FungibleToken",
                    pin_contract_address: "0x9a0766d93b6608b7",
                    imports: [],
                  },
                },
                {
                  network: "emulator",
                  address: "0xee82856bf20e2aa6",
                  dependency_pin_block_height: 0,
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
          messages: [
            {
              key: "title",
              i18n: [
                {
                  tag: "en-US",
                  translation: "Amount",
                },
              ],
            },
            {
              key: "description",
              i18n: [
                {
                  tag: "en-US",
                  translation: "The amount of FLOW tokens to send",
                },
              ],
            },
          ],
        },
        {
          label: "to",
          index: 1,
          type: "Address",
          messages: [
            {
              key: "title",
              i18n: [
                {
                  tag: "en-US",
                  translation: "To",
                },
              ],
            },
            {
              key: "description",
              i18n: [
                {
                  tag: "en-US",
                  translation: "The Flow account the tokens will go to",
                },
              ],
            },
          ],
        },
      ],
    },
  }

  test("v1.1.0, mainnet network hash is derived correctly", async () => {
    const networkDependencies = {FungibleToken: "0xf233dcee88fe0abe"}

    const popCadence = replaceStringImports({
      cadence: template.data.cadence.body,
      networkDependencies,
    })

    const hash = genHash(popCadence)

    expect(hash).toEqual(template.data.cadence.network_pins[0].pin_self)
  })

  test("Test id generation and compare", async () => {
    const testId = template.id
    const id = await generateTemplateId({
      template,
    })

    expect(id).toEqual(testId)
  })
})
