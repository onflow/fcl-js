import {SdkTransport} from "@onflow/typedefs"
import {getGlobalTransport} from "./get-global-transport"
import {httpTransport} from "@onflow/transport-http"

jest.mock("@onflow/transport-http", () => ({
  httpTransport: {
    send: jest.fn(),
    subscribe: jest.fn(),
  } as jest.Mocked<SdkTransport>,
}))

describe("getGlobalTransport", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test("fallback to http transport", () => {
    const transport = getGlobalTransport({})
    expect(transport).toBe(httpTransport)
  })

  test("transport from global config - sdk.transport", () => {
    const customTransport = {
      send: jest.fn(),
      subscribe: jest.fn(),
    } as jest.Mocked<SdkTransport>

    const transport = getGlobalTransport({
      "sdk.transport": customTransport,
    })

    expect(transport).toBe(customTransport)
  })

  test("send function from global config - sdk.transport", () => {
    const customSend = jest.fn()

    const transport = getGlobalTransport({
      "sdk.transport": customSend,
    })

    expect(transport).toEqual({
      send: customSend,
      subscribe: expect.any(Function),
    })
  })

  test("send function from global config - sdk.send", () => {
    const customSend = jest.fn()

    const transport = getGlobalTransport({
      "sdk.send": customSend,
    })

    expect(transport).toEqual({
      send: customSend,
      subscribe: expect.any(Function),
    })
  })

  test("sdk.transport has priority over sdk.send", () => {
    const transportSend = jest.fn()
    const sdkSend = jest.fn()

    const transport = getGlobalTransport({
      "sdk.transport": transportSend,
      "sdk.send": sdkSend,
    })

    expect(transport).toEqual({
      send: transportSend,
      subscribe: expect.any(Function),
    })
  })
})
