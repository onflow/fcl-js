import {getTemplateArgumentMessage} from "./get-template-argument-message.js"

describe("Get interaction template argument messages", () => {
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

  test("It gets argument message for given argument and internationalization", async () => {
    let message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "amount",
      messageKey: "title",
      template,
    })

    expect(message).toEqual("The amount of FLOW tokens to send")
  })

  test("It fails to get message for an unknown argument", async () => {
    let message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "foo",
      messageKey: "title",
      template,
    })

    expect(message).toEqual(undefined)
  })

  test("It fails to get message for an unknown message key", async () => {
    let message = getTemplateArgumentMessage({
      localization: "en-US",
      argumentLabel: "amount",
      messageKey: "baz",
      template,
    })

    expect(message).toEqual(undefined)
  })
})
