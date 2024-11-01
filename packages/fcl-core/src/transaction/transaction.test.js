import {HTTPRequestError} from "@onflow/transport-http"
import {transaction} from "./index.js"
import {config} from "@onflow/config"

describe("transaction", () => {
  let currentId = 0
  let txId = null

  beforeEach(() => {
    // unique txId for each test case
    txId = String(currentId++).toString(16).padStart(64, "0")
  })

  test("should throw if transactionId is not a 64 byte hash", () => {
    expect(() => transaction("not a 64 byte hash")).toThrow(
      "Invalid transactionId"
    )
  })

  test("should ignore not found errors", async () => {
    const mockStatus = {
      status: 1,
      events: [],
    }
    let requestCount = 0
    await config.overload(
      {
        "accessNode.api": "http://example.com",
        "sdk.transport": (ix, context) => {
          if (requestCount++ === 0)
            throw new HTTPRequestError({
              statusCode: 404,
              responseStatusText: "Not Found",
            })

          return {
            ...context.response(),
            tag: ix.tag,
            transactionStatus: mockStatus,
          }
        },
      },
      async () => {
        const tx = transaction(txId)
        let receivedVal = null
        await new Promise(resolve => {
          const unsub = tx.subscribe(x => {
            if (requestCount < 2) return
            receivedVal = x
            unsub()
            resolve()
          })
        })
        expect(receivedVal).toEqual(mockStatus)
      }
    )
  }, 10000)

  test("no timeout if valid transaction status has been received", async () => {
    // Set timeout short so we don't have to wait long
    const txNotFoundTimeout = 100
    // If we make it past the timeout, we know that polling continues as it should
    const waitTime = 1000

    const mockStatus = {
      status: 1,
      events: [],
    }
    await config.overload(
      {
        "accessNode.api": "http://example.com",
        "sdk.transport": (ix, context) => {
          return {
            ...context.response(),
            tag: ix.tag,
            transactionStatus: mockStatus,
          }
        },
      },
      async () => {
        const tx = transaction(txId, {txNotFoundTimeout})

        await expect(
          new Promise((resolve, reject) => {
            // If we make it past the timeout, we know that polling continues
            setTimeout(() => {
              resolve()
              unsub()
            }, waitTime)

            const unsub = tx.subscribe((_, err) => {
              if (err) {
                unsub()
                reject(err)
              }
            })
          })
        ).resolves.toBeUndefined()
      }
    )
  })

  test("timeout if no valid transaction status has been received", async () => {
    // Set timeout short so we don't have to wait long
    const txNotFoundTimeout = 100
    // If we make it past the timeout, we know that polling continues (which is not what we want)
    const waitTime = 1000

    await config.overload(
      {
        "accessNode.api": "http://example.com",
        "sdk.transport": () => {
          // only 404s will be thrown
          throw new HTTPRequestError({
            statusCode: 404,
            responseStatusText: "Not Found",
          })
        },
      },
      async () => {
        const tx = transaction(txId, {txNotFoundTimeout})

        await expect(
          new Promise((resolve, reject) => {
            // If we make it past the timeout, we know that polling continues
            setTimeout(() => {
              resolve()
              unsub()
            }, waitTime)

            const unsub = tx.subscribe((_, err) => {
              if (err) {
                console.log(err)
                unsub()
                reject(err)
              }
            })
          })
        ).rejects.toThrowError(
          `TX status polling failed: no transaction was found within timeout interval (${txNotFoundTimeout}ms)`
        )
      }
    )
  })
})
