import {getTemplateArgumentMessage} from "./get-template-argument-message.js"

describe("Get interaction template argument messages", () => {
  const templatev1 = {
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

  test("It gets argument message for given argument and internationalization", async () => {
    const message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "amount",
      messageKey: "title",
      template: templatev1,
    })

    expect(message).toEqual("The amount of FLOW tokens to send")
  })

  test("It fails to get message for an unknown argument", async () => {
    const message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "foo",
      messageKey: "title",
      template: templatev1,
    })

    expect(message).toEqual(undefined)
  })

  test("It fails to get message for an unknown message key", async () => {
    const message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "amount",
      messageKey: "baz",
      template: templatev1,
    })

    expect(message).toEqual(undefined)
  })
})

describe("Get interaction template v1.1.0 parameters messages", () => {
  const templatev11 = {
    f_type: "InteractionTemplate",
    f_version: "1.1.0",
    id: "3a99af243b85f3f6af28304af2ed53a37fb913782b3efc483e6f0162a47720a0",
    data: {
      type: "transaction",
      interface: "",
      messages: [
        {
          key: "title",
          i18n: [
            {
              tag: "en-US",
              translation: "Transfer Flow",
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

  test("It gets argument message for given argument and internationalization", async () => {
    const message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "amount",
      messageKey: "title",
      template: templatev11,
    })

    expect(message).toEqual("Amount")
  })

  test("It fails to get message for an unknown argument", async () => {
    const message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "foo",
      messageKey: "title",
      template: templatev11,
    })

    expect(message).toEqual(undefined)
  })

  test("It fails to get message for an unknown message key", async () => {
    const message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "amount",
      messageKey: "baz",
      template: templatev11,
    })

    expect(message).toEqual(undefined)
  })
})
