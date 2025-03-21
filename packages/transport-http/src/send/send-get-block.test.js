import {sendGetBlock} from "./send-get-block.js"
import {Buffer} from "@onflow/rlp"
import {
  atBlockHeight,
  atBlockId,
  build,
  getBlock,
  resolve,
  response as responseADT,
} from "@onflow/sdk"

describe("Send Get Block", () => {
  test("GetBlockByID", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlock = [
      {
        header: {
          id: "a1b2c3",
          parent_id: "a1b2c3",
          height: "123",
          timestamp: dateNow.toISOString(),
        },
        payload: {
          collection_guarantees: [],
          block_seals: [],
        },
      },
    ]

    httpRequestMock.mockReturnValue(returnedBlock)

    const response = await sendGetBlock(
      await resolve(await build([getBlock(), atBlockId("a1b2c3")])),
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
      path: "/v1/blocks/a1b2c3?expand=payload",
      method: "GET",
      body: null,
    })

    expect(response.block).toEqual({
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
      collectionGuarantees: [],
      blockSeals: [],
    })
  })

  test("GetBlockByHeight", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlock = [
      {
        header: {
          id: "a1b2c3",
          parent_id: "a1b2c3",
          height: "123",
          timestamp: dateNow.toISOString(),
        },
        payload: {
          collection_guarantees: [],
          block_seals: [],
        },
      },
    ]

    httpRequestMock.mockReturnValue(returnedBlock)

    const response = await sendGetBlock(
      await resolve(await build([getBlock(), atBlockHeight(123)])),
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
      path: "/v1/blocks?height=123&expand=payload",
      method: "GET",
      body: null,
    })

    expect(response.block).toEqual({
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
      collectionGuarantees: [],
      blockSeals: [],
    })
  })

  test("GetLatestBlock - isSealed = false", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlock = [
      {
        header: {
          id: "a1b2c3",
          parent_id: "a1b2c3",
          height: "123",
          timestamp: dateNow.toISOString(),
        },
        payload: {
          collection_guarantees: [],
          block_seals: [],
        },
      },
    ]

    httpRequestMock.mockReturnValue(returnedBlock)

    const response = await sendGetBlock(
      await resolve(await build([getBlock()])),
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
      path: "/v1/blocks?height=final&expand=payload",
      method: "GET",
      body: null,
    })

    expect(response.block).toEqual({
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
      collectionGuarantees: [],
      blockSeals: [],
    })
  })

  test("GetLatestBlock - isSealed = true", async () => {
    const httpRequestMock = jest.fn()

    const dateNow = new Date(Date.now())

    const returnedBlock = [
      {
        header: {
          id: "a1b2c3",
          parent_id: "a1b2c3",
          height: "123",
          timestamp: dateNow.toISOString(),
        },
        payload: {
          collection_guarantees: [],
          block_seals: [],
        },
      },
    ]

    httpRequestMock.mockReturnValue(returnedBlock)

    const response = await sendGetBlock(
      await resolve(await build([getBlock(true)])),
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
      path: "/v1/blocks?height=sealed&expand=payload",
      method: "GET",
      body: null,
    })

    expect(response.block).toEqual({
      id: "a1b2c3",
      parentId: "a1b2c3",
      height: 123,
      timestamp: dateNow.toISOString(),
      collectionGuarantees: [],
      blockSeals: [],
    })
  })
})
