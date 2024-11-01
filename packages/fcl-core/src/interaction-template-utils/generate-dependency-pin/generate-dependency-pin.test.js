import {
  generateDependencyPin110,
  generateDependencySelfPin,
} from "./generate-dependency-pin-1.1.0.js"
import {config} from "@onflow/config"

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
}))

describe("1.1.0, generate dependency pin", () => {
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterAll(() => {
    console.warn.mockRestore()
  })

  test("v1.1.0, get dependency pin", async () => {
    const pin =
      "ac0208f93d07829ec96584d618ddbec6af3cf4e2866bd5071249e8ec93c7e0dc"

    config.put("flow.network", "mainnet")
    config.put("accessNode.api", "https://rest-mainnet.onflow.org")

    const depPin = await generateDependencyPin110({
      address: "0xf233dcee88fe0abe",
      contractName: "FungibleToken",
    })

    expect(depPin).toEqual(pin)
  })
})
