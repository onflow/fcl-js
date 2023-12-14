import {getTemplateMessage} from "./get-template-message.js"

describe("Get interaction template messages 1.0.0", () => {
  let template = {
    f_type: "InteractionTemplate",
    f_version: "1.0.0",
    id: "abc123",
    data: {
      type: "transaction",
      interface: "",
      messages: {
        title: {
          i18n: {
            "en-US": "Transfer Tokens",
          },
        },
        description: {
          i18n: {
            "en-US": "Transfer tokens from one account to another",
          },
        },
      },
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
      arguments: {
        amount: {
          index: 0,
          type: "UFix64",
          messages: {
            title: {
              i18n: {
                "en-US": "The amount of FLOW tokens to send",
              },
            },
          },
        },
        to: {
          index: 1,
          type: "Address",
          messages: {
            title: {
              i18n: {
                "en-US": "The Flow account the tokens will go to",
              },
            },
          },
        },
      },
    },
  }

  test("It gets template message for given message key and internationalization", async () => {
    const title = await getTemplateMessage({
      localization: "en-US",
      messageKey: "title",
      template,
    })

    expect(title).toEqual("Transfer Tokens")

    const description = await getTemplateMessage({
      localization: "en-US",
      messageKey: "description",
      template,
    })

    expect(description).toEqual("Transfer tokens from one account to another")
  })

  test("It fails to get message for an unknown message key", async () => {
    let message = await getTemplateMessage({
      localization: "en-US",
      messageKey: "foo",
      template,
    })

    expect(message).toEqual(undefined)
  })
})

describe("Get interaction template messages 1.1.0", () => {
  let template = {
    f_type: "InteractionTemplate", // Data Type
    f_version: "1.1.0", // Data Type Version
    id: "a2b2d73def...aabc5472d2", // Unique ID for the data structure.
    data: {
      type: "transaction", // "transaction" || "script"
      interface: "asadf23234...fas234234", // ID of InteractionTemplateInterface this conforms to.
      messages: [
        {
          key: "title",
          i18n: [
            // Internationalised (BCP-47) set of human readable messages about the interaction
            {
              tag: "en-US",
              translation: "Transfer Tokens",
            },
            {
              tag: "fr-FR",
              translation: "FLOW de transfert",
            },
            {
              tag: "zh-CN",
              translation: "转移流程",
            },
          ],
        },
        {
          key: "description",
          i18n: [
            // Internationalised (BCP-47) set of human readable messages about the interaction
            {
              tag: "en-US",
              translation: "Transfer {amount} FLOW to {to}", // Messages might consume arguments.
            },
            {
              tag: "fr-FR",
              translation: "Transférez {amount} FLOW à {to}",
            },
            {
              tag: "zh-CN",
              translation: "将 {amount} FLOW 转移到 {to}",
            },
          ],
        },
      ],
      // Cadence code this interaction executes.
      cadence: `
      import FungibleToken from 0xFUNGIBLETOKENADDRESS
      transaction(amount: UFix64, to: Address) {
          let vault: @FungibleToken.Vault
          prepare(signer: AuthAccount) {
              %%self.vault <- signer
              .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
              .withdraw(amount: amount)
  
              self.vault <- FungibleToken.getVault(signer)
          }
          execute {
              getAccount(to)
              .getCapability(/public/flowTokenReceiver)!
              .borrow<&{FungibleToken.Receiver}>()!
              .deposit(from: <-self.vault)
          }
      }
      `,
      dependencies: [
        {
          address: "0xFUNGIBLETOKENADDRESS", // Network (mainnet || testnet) dependent locations for 0xFUNGIBLETOKENADDRESS contract.
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
      arguments: [
        {
          label: "amount",
          index: 0,
          type: "UFix64",
          messages: [
            // Set of human readable messages about the argument
            {
              key: "title",
              i18n: [
                // Internationalised (BCP-47) set of human readable messages about the argument
                {
                  tag: "en-US",
                  translation: "Amount", // Messages might consume arguments.
                },
                {
                  tag: "fr-FR",
                  translation: "Montant",
                },
                {
                  tag: "zh-CN",
                  translation: "数量",
                },
              ],
            },
            {
              key: "description",
              i18n: [
                // Internationalised (BCP-47) set of human readable messages about the argument
                {
                  tag: "en-US",
                  translation: "Amount of FLOW token to transfer", // Messages might consume arguments.
                },
                {
                  tag: "fr-FR",
                  translation: "Quantité de token FLOW à transférer",
                },
                {
                  tag: "zh-CN",
                  translation: "要转移的 FLOW 代币数量",
                },
              ],
            },
          ],
          balance: "0xFUNGIBLETOKENADDRESS.FungibleToken", // The token this argument acts upon.
        },
        {
          label: "to",
          index: 1,
          type: "Address",
          messages: [
            // Set of human readable messages about the argument
            {
              key: "title",
              i18n: [
                // Internationalised (BCP-47) set of human readable messages about the argument
                {
                  tag: "en-US",
                  translation: "To", // Messages might consume arguments.
                },
                {
                  tag: "fr-FR",
                  translation: "Pour",
                },
                {
                  tag: "zh-CN",
                  translation: "到",
                },
              ],
            },
            {
              key: "description",
              i18n: [
                // Internationalised (BCP-47) set of human readable messages about the argument
                {
                  tag: "en-US",
                  translation: "Amount of FLOW token to transfer", // Messages might consume arguments.
                },
                {
                  tag: "fr-FR",
                  translation:
                    "Le compte vers lequel transférer les jetons FLOW",
                },
                {
                  tag: "zh-CN",
                  translation: "将 FLOW 代币转移到的帐户",
                },
              ],
            },
          ],
        },
      ],
    },
  }

  test("It gets template message for given message key and internationalization", async () => {
    const title = await getTemplateMessage({
      localization: "en-US",
      messageKey: "title",
      template,
    })

    expect(title).toEqual("Transfer Tokens")

    const description = await getTemplateMessage({
      localization: "en-US",
      messageKey: "description",
      template,
    })

    expect(description).toEqual("Transfer {amount} FLOW to {to}")
  })

  test("It fails to get message for an unknown message key", async () => {
    let message = await getTemplateMessage({
      localization: "en-US",
      messageKey: "foo",
      template,
    })

    expect(message).toEqual(undefined)
  })
})
