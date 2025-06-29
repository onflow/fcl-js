import {retrieve} from "./document"
import {createMockContext} from "../test-utils/mock-context"

describe("resolveArguments", () => {
  test("Should invoke resolver", async () => {
    const templateResolver = jest.fn()
    const {config} = createMockContext({
      configValues: {"document.resolver.testprotocol": templateResolver},
    })

    const ret = await retrieve(config, {url: "testprotocol://example.test"})

    expect(templateResolver.mock.calls.length).toEqual(1)
  })
})
