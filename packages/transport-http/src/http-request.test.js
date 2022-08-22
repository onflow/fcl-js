import * as fetchTransport from "node-fetch"
import * as logger from "@onflow/util-logger"
import {httpRequest} from "./http-request"
import {Readable} from "stream"

const mockHttpResponse = ({
  status = 200,
  body: bodyText = "",
  statusText = null,
  ...args
}) => {
  const body = new Readable()
  body.push(bodyText)
  body.push(null)

  const readStreamToString = readableStream => {
    let res = "",
      current
    while ((current = readableStream.read())) res += current
    return res
  }

  return {
    ok: status >= 200 && status < 300,
    status,
    body,
    async json() {
      return JSON.parse(readStreamToString(this.body))
    },
    async text() {
      return readStreamToString(this.body)
    },
    statusText,
    ...args,
  }
}

describe("httpRequest", () => {
  test("makes valid fetch request", async () => {
    const spy = jest.spyOn(fetchTransport, "default")
    spy.mockImplementation(async () => ({
      ok: true,
      status: 200,
      body: JSON.stringify({
        foo: "bar",
      }),
      async json() {
        return JSON.parse(this.body)
      },
    }))

    const opts = {
      hostname: "https://example.com",
      path: "/foo/bar",
      body: "abc123",
      method: "POST",
      headers: {
        Authorization: "Bearer 1RyXjsFJfU",
      },
    }

    await httpRequest(opts)

    await expect(spy).toHaveBeenCalledWith(`${opts.hostname}${opts.path}`, {
      method: opts.method,
      body: JSON.stringify(opts.body),
      headers: opts.headers,
    })
  })

  test("returns result of valid http response", async () => {
    const spy = jest.spyOn(fetchTransport, "default")
    const responseBody = {
      foo: "bar",
    }
    spy.mockImplementation(async () =>
      mockHttpResponse({
        status: 200,
        body: JSON.stringify(responseBody),
      })
    )

    const opts = {
      hostname: "https://example.com",
      path: "/foo/bar",
      body: "abc123",
      method: "POST",
      headers: {
        Authorization: "Bearer 1RyXjsFJfU",
      },
    }

    const result = await httpRequest(opts)

    await expect(result).toEqual(responseBody)
  })

  test("handles http error properly, throws HTTP error", async () => {
    const spy = jest.spyOn(fetchTransport, "default")
    spy.mockImplementation(async () =>
      mockHttpResponse({
        status: 400,
        body: JSON.stringify({foo: "bar"}),
        statusText: "foo bar",
      })
    )

    const opts = {
      hostname: "https://example.com",
      path: "/foo/bar",
      body: "abc123",
      method: "POST",
      headers: {
        Authorization: "Bearer 1RyXjsFJfU",
      },
    }

    await expect(httpRequest(opts)).rejects.toThrow("HTTP Request Error:")
  })

  test("retries retriable error", async () => {
    const spy = jest.spyOn(fetchTransport, "default")

    const mockBadResponse = mockHttpResponse({
      body: "",
      status: 429, // 429 is a retriable error
      statusText: "Too many requests",
    })

    const goodBody = {
      foo: "bar",
    }
    const mockGoodResponse = mockHttpResponse({
      body: JSON.stringify(goodBody),
      status: 200,
    })

    spy.mockImplementation(async () => {
      if (spy.mock.calls.length === 1) return mockBadResponse
      return mockGoodResponse
    })

    const opts = {
      hostname: "https://example.com",
      path: "/foo/bar",
      body: "abc123",
      method: "POST",
    }

    const response = await httpRequest(opts)

    await expect(response).toEqual(goodBody)
  })

  test("handles fetch error properly, displays AN error", async () => {
    const fetchSpy = jest.spyOn(fetchTransport, "default")

    fetchSpy.mockImplementation(() =>
      Promise.reject(
        mockHttpResponse({
          body: JSON.stringify({
            foo: "bar",
          }),
          status: 400,
          statusText: "foo bar",
        })
      )
    )

    const loggerSpy = jest.spyOn(logger, "log")
    loggerSpy.mockImplementation(() => {})

    const opts = {
      hostname: "https://example.com",
      path: "/foo/bar",
      body: "abc123",
      method: "POST",
      headers: {
        Authorization: "Bearer 1RyXjsFJfU",
      },
    }

    await expect(httpRequest(opts)).rejects.toThrow("HTTP Request Error:")
    expect(loggerSpy.mock.calls[0][0].title).toBe("Access Node Error")
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
