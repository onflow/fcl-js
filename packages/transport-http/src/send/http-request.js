import * as logger from "@onflow/util-logger"
import fetchTransport from "cross-fetch"
import {safeParseJSON} from "./utils"
import {combineURLs} from "./combine-urls"

const AbortController =
  globalThis.AbortController || require("abort-controller")

export class HTTPRequestError extends Error {
  constructor({
    error,
    hostname,
    path,
    method,
    requestBody,
    responseBody,
    responseStatusText,
    statusCode,
  }) {
    const msg = `
      HTTP Request Error: An error occurred when interacting with the Access API.
      ${error ? `error=${error}` : ""}
      ${hostname ? `hostname=${hostname}` : ""}
      ${path ? `path=${path}` : ""}
      ${method ? `method=${method}` : ""}
      ${requestBody ? `requestBody=${requestBody}` : ""}
      ${responseBody ? `responseBody=${responseBody}` : ""}
      ${responseStatusText ? `responseStatusText=${responseStatusText}` : ""}
      ${statusCode ? `statusCode=${statusCode}` : ""}
    `
    super(msg)

    this.name = "HTTP Request Error"
    this.statusCode = statusCode
    this.errorMessage = error
  }
}

/**
 * Creates an HTTP Request to be sent to a REST Access API via Fetch API.
 *
 * @param {object} options - Options for the HTTP Request
 * @param {String} options.hostname - Access API Hostname
 * @param {String} options.path - Path to the resource on the Access API
 * @param {String} options.method - HTTP Method
 * @param {object} options.body - HTTP Request Body
 * @param {object} [options.headers] - HTTP Request Headers
 * @param {boolean} [options.enableRequestLogging=true] - Enable/Disable request logging
 * @param {number} [options.retryLimit=5] - Number of times to retry request
 * @param {number} [options.retryIntervalMs=1000] - Time in milliseconds to wait before retrying request
 * @param {number} [options.timeoutLimit=30000] - Time in milliseconds to wait before timing out request
 *
 * @returns JSON object response from Access API.
 */
export async function httpRequest({
  hostname,
  path,
  method,
  body,
  headers,
  retryLimit = 5,
  retryIntervalMs = 1000,
  timeoutLimit = 30000,
  enableRequestLogging = true,
}) {
  const bodyJSON = body ? JSON.stringify(body) : null

  function makeRequest() {
    const controller = new AbortController()
    const fetchTimeout = setTimeout(() => {
      controller.abort()
    }, timeoutLimit)

    return fetchTransport(combineURLs(hostname, path).toString(), {
      method: method,
      body: bodyJSON,
      headers,
      signal: controller.signal,
    })
      .then(async res => {
        if (res.ok) {
          return res.json()
        }

        const responseText = await res.text().catch(() => null)
        const response = safeParseJSON(responseText)

        throw new HTTPRequestError({
          error: response?.message,
          hostname,
          path,
          method,
          requestBody: bodyJSON,
          responseBody: responseText,
          responseStatusText: res.statusText,
          statusCode: res.status,
        })
      })
      .catch(async e => {
        if (e instanceof HTTPRequestError) {
          throw e
        }

        if (e.name === "AbortError") {
          throw e
        }

        // Show AN error for all network errors
        if (enableRequestLogging) {
          await logger.log({
            title: "Access Node Error",
            message: `The provided access node ${hostname} does not appear to be a valid REST/HTTP access node.
  Please verify that you are not unintentionally using a GRPC access node.
  See more here: https://docs.onflow.org/fcl/reference/sdk-guidelines/#connect`,
            level: logger.LEVELS.error,
          })
        }

        throw new HTTPRequestError({
          error: e?.message,
          hostname,
          path,
          method,
          requestBody: bodyJSON,
        })
      })
      .finally(() => {
        clearTimeout(fetchTimeout)
      })
  }

  async function requestLoop(retryAttempt = 0) {
    try {
      const resp = await makeRequest()
      return resp
    } catch (error) {
      const retryStatusCodes = [408, 429, 500, 502, 503, 504]

      if (
        error.name === "AbortError" ||
        retryStatusCodes.includes(error.statusCode)
      ) {
        return await new Promise((resolve, reject) => {
          if (retryAttempt < retryLimit) {
            if (enableRequestLogging) {
              console.warn(
                `Access node unavailable, retrying in ${retryIntervalMs} ms...`
              )
            }
            setTimeout(() => {
              resolve(requestLoop(retryAttempt + 1))
            }, retryIntervalMs)
          } else {
            reject(error)
          }
        })
      } else {
        throw error
      }
    }
  }

  // Keep retrying request until server available or max attempts exceeded
  return await requestLoop()
}
