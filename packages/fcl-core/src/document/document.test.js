import {retrieve} from "./document.js"
import {config} from "@onflow/config"

describe("resolveArguments", () => {
  test("Should invoke resolver", async () => {
    const templateResolver = jest.fn()

    const ret = await config.overload(
      {
        "document.resolver.testprotocol": templateResolver,
      },
      async d => {
        await retrieve({url: "testprotocol://example.test"})

        expect(templateResolver.mock.calls.length).toEqual(1)
      }
    )
  })
})
