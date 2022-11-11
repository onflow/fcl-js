import {getTemplateMessage} from "./get-template-message"

describe("Derive cadence by network", () => {
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
    const title = getTemplateMessage({
      localization: "en-US",
      messageKey: "title",
      template,
    })

    expect(title).toEqual("Transfer Tokens")

    const description = getTemplateMessage({
      localization: "en-US",
      messageKey: "description",
      template,
    })

    expect(description).toEqual("Transfer tokens from one account to another")
  })

  test("It fails to get message for an unknown message key", async () => {
    let message = getTemplateMessage({
      localization: "en-US",
      messageKey: "foo",
      template,
    })

    expect(message).toEqual(undefined)
  })
})
