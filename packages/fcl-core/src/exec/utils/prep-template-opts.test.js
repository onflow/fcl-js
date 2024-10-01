import {config} from "@onflow/config"
import {prepTemplateOpts} from "./prep-template-opts.js"

describe("Prepare template options for template version 1.0.0", () => {
  // NOTE: template10 and template11 copied from packages\fcl-core\src\interaction-template-utils\derive-cadence-by-network\derive-cadence-by-network.test.js
  const template10 = {
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

  test("It prepares cadence and dependencies from template version 1.0.0 for mainnet", async () => {
    // prepTemplateOpts can take chain ID from multiple sources, but config has precedence
    config.put("flow.network", "mainnet")

    const resultMainnet = await prepTemplateOpts({
      template: template10,
    })

    expect(resultMainnet.cadence).toEqual(
      "import FungibleToken from 0xf233dcee88fe0abe\n"
    )
  })

  test("It prepares cadence and dependencies from template version 1.0.0 for testnet", async () => {
    // prepTemplateOpts can take chain ID from multiple sources, but config has precedence
    config.put("flow.network", "testnet")

    const resultTestnet = await prepTemplateOpts({
      template: template10,
    })

    expect(resultTestnet.cadence).toEqual(
      "import FungibleToken from 0x9a0766d93b6608b7\n"
    )
  })

  test("It fails to prepare cadence and dependencies from template version 1.0.0 for unknown network", async () => {
    config.put("flow.network", "randomnet")

    const test = async () =>
      await prepTemplateOpts({
        template: template10,
      })

    await expect(test()).rejects.toThrow(Error)
  })
})

describe("Prepare template options for template version 1.1.0", () => {
  const template11 = {
    f_type: "InteractionTemplate",
    f_version: "1.1.0",
    id: "3a99af243b85f3f6af28304af2ed53a37fb913782b3efc483e6f0162a47720a0",
    data: {
      type: "transaction",
      interface: "",
      messages: [],
      cadence: {
        body: 'import "FungibleToken"\n',
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
      parameters: [],
    },
  }

  test("It prepares cadence and dependencies from template version 1.1.0 for mainnet", async () => {
    // prepTemplateOpts can take chain ID from multiple sources, but config has precedence
    config.put("flow.network", "mainnet")

    const resultMainnet = await prepTemplateOpts({
      template: template11,
    })

    expect(resultMainnet.cadence).toEqual(
      "import FungibleToken from 0xf233dcee88fe0abe\n"
    )
  })

  test("It prepares cadence and dependencies from template version 1.1.0 for testnet", async () => {
    // prepTemplateOpts can take chain ID from multiple sources, but config has precedence
    config.put("flow.network", "testnet")

    const resultTestnet = await prepTemplateOpts({
      template: template11,
    })

    expect(resultTestnet.cadence).toEqual(
      "import FungibleToken from 0x9a0766d93b6608b7\n"
    )
  })

  test("It fails to prepare cadence and dependencies from template version 1.1.0 for unknown network", async () => {
    config.put("flow.network", "randomnet")

    const test = async () =>
      await prepTemplateOpts({
        template: template,
      })

    await expect(test()).rejects.toThrow(Error)
  })
})
