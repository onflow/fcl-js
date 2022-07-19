import * as logger from "@onflow/util-logger"
import fetchTransport from "node-fetch"

class HTTPRequestError extends Error {
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
      ${requestBody ? `requestBody=${JSON.stringify(requestBody)}` : ""}
      ${responseBody ? `responseBody=${JSON.stringify(responseBody)}` : ""}
      ${responseStatusText ? `responseStatusText=${responseStatusText}` : ""}
      ${statusCode ? `statusCode=${statusCode}` : ""}
    `
    super(msg)
    this.name = "HTTP Request Error"
    this.statusCode = responseBody?.code ?? statusCode
    this.errorMessage = responseBody?.message
  }
}

/**
 * Creates an HTTP Request to be sent to a REST Access API via Fetch API.
 *
 * @param {Object} options - Options for the HTTP Request
 * @param {String} options.hostname - Access API Hostname
 * @param {String} options.path - Path to the resource on the Access API
 * @param {String} options.method - HTTP Method
 * @param {any} options.body - HTTP Request Body
 * @param {Object | Headers} [options.headers] - HTTP Request Headers
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
}) {
  async function requestLoop(retryAttempt = 0) {
    try {
      const resp = await makeRequest()
      return resp
    } catch (error) {
      const retryStatusCodes = [408, 500, 502, 503, 504]

      if (retryStatusCodes.includes(error.statusCode)) {
        return await new Promise((resolve, reject) => {
          if (retryAttempt < retryLimit) {
            console.log(
              `Access node unavailable, retrying in ${retryIntervalMs} ms...`
            )
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

  function makeRequest() {
    return fetchTransport(`${hostname}${path}`, {
      method: method,
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
      .then(async res => {
        if (res.ok) {
          return res.json()
        }

        const responseJSON = res.body ? await res.json() : null

        throw new HTTPRequestError({
          error: responseJSON?.message,
          hostname,
          path,
          method,
          requestBody: body,
          responseBody: responseJSON,
          responseStatusText: res.statusText,
          statusCode: res.status,
        })
      })
      .catch(async e => {
        if (e instanceof HTTPRequestError) {
          throw e
        }

        // Show AN error for all network errors
        await logger.log({
          title: "Access Node Error",
          message: `The provided access node ${hostname} does not appear to be a valid REST/HTTP access node.
Please verify that you are not unintentionally using a GRPC access node.
See more here: https://docs.onflow.org/fcl/reference/sdk-guidelines/#connect`,
          level: logger.LEVELS.error,
        })

        throw new HTTPRequestError({
          error: e?.message,
          hostname,
          path,
          method,
          requestBody: body,
        })
      })
  }

  // Keep retrying request until server available or max attempts exceeded
  return await requestLoop()
}
