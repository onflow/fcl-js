import {sendGetBlockHeader} from "./send-get-block-header.js"
import {Buffer} from "@onflow/rlp"
import {
  atBlockHeight,
  atBlockId,
  build,
  getBlockHeader,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Send Get Block Header", () => {
  test("GetBlockHeaderByID", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlockHeader = [
      {
        header: {
          id: "a1b2c3",
          parent_id: "a1b2c3",
          height: "123",
          timestamp: dateNow.toISOString(),
        },
      },
    ]

    httpRequestMock.mockReturnValue(returnedBlockHeader)

    const response = await sendGetBlockHeader(
      await resolve(await build([getBlockHeader(), atBlockId("a1b2c3")])),
      {
        response: responseADT,
        Buffer,
      },
      {
        httpRequest: httpRequestMock,
        node: "localhost",
      }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
      hostname: "localhost",
      path: "/v1/blocks/a1b2c3",
      method: "GET",
      body: null,
    })

    expect(response.blockHeader).toEqual({
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
    })
  })

  test("GetBlockHeaderByHeight", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlockHeader = [
      {
        header: {
          id: "a1b2c3",
          parent_id: "a1b2c3",
          height: "123",
          timestamp: dateNow.toISOString(),
        },
      },
    ]

    httpRequestMock.mockReturnValue(returnedBlockHeader)

    const response = await sendGetBlockHeader(
      await resolve(await build([getBlockHeader(), atBlockHeight(123)])),
      {
        response: responseADT,
        Buffer,
      },
      {
        httpRequest: httpRequestMock,
        node: "localhost",
      }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
      hostname: "localhost",
      path: "/v1/blocks?height=123",
      method: "GET",
      body: null,
    })

    expect(response.blockHeader).toEqual({
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
    })
  })

  test("GetLatestBlockHeader - isSealed = false", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlockHeader = [
      {
        header: {
          id: "a1b2c3",
          parent_id: "a1b2c3",
          height: "123",
          timestamp: dateNow.toISOString(),
        },
      },
    ]

    httpRequestMock.mockReturnValue(returnedBlockHeader)

    const response = await sendGetBlockHeader(
      await resolve(await build([getBlockHeader()])),
      {
        response: responseADT,
        Buffer,
      },
      {
        httpRequest: httpRequestMock,
        node: "localhost",
      }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
      hostname: "localhost",
      path: "/v1/blocks?height=final",
      method: "GET",
      body: null,
    })

    expect(response.blockHeader).toEqual({
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
    })
  })

  test("GetLatestBlockHeader - isSealed = true", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlockHeader = [
      {
        header: {
          id: "a1b2c3",
          parent_id: "a1b2c3",
          height: 123,
          timestamp: dateNow.toISOString(),
        },
      },
    ]

    httpRequestMock.mockReturnValue(returnedBlockHeader)

    const response = await sendGetBlockHeader(
      await resolve(await build([getBlockHeader(true)])),
      {
        response: responseADT,
        Buffer,
      },
      {
        httpRequest: httpRequestMock,
        node: "localhost",
      }
    )

    expect(httpRequestMock.mock.calls.length).toEqual(1)

    const httpRequestMockArgs = httpRequestMock.mock.calls[0]

    expect(httpRequestMockArgs.length).toEqual(1)

    const valueSent = httpRequestMock.mock.calls[0][0]

    expect(valueSent).toEqual({
      hostname: "localhost",
      path: "/v1/blocks?height=sealed",
      method: "GET",
      body: null,
    })

    expect(response.blockHeader).toEqual({
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
    })
  })
})
