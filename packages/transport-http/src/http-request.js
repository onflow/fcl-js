import {invariant} from "@onflow/util-invariant"
import {getNodeHttpModules} from "@onflow/util-node-http-modules"

class HTTPRequestError extends Error {
  constructor({
    transport,
    error,
    hostname,
    path,
    port,
    method,
    requestBody,
    responseBody,
    responseStatusText,
    reqOn,
    statusCode,
  }) {
    const msg = `
      HTTP Request Error: An error occurred when interacting with the Access API.
      ${transport ? `transport=${transport}` : ""}
      ${error ? `error=${error}` : ""}
      ${hostname ? `hostname=${hostname}` : ""}
      ${path ? `path=${path}` : ""}
      ${port ? `port=${port}` : ""}
      ${method ? `method=${method}` : ""}
      ${requestBody ? `requestBody=${JSON.stringify(requestBody)}` : ""}
      ${responseBody ? `responseBody=${JSON.stringify(responseBody)}` : ""}
      ${responseStatusText ? `responseStatusText=${responseStatusText}` : ""}
      ${reqOn ? `reqOn=${reqOn}` : ""}
      ${statusCode ? `statusCode=${statusCode}` : ""}
    `
    super(msg)
    this.name = "HTTP Request Error"
    this.statusCode = responseBody?.code ?? statusCode
    this.errorMessage = responseBody?.message
  }
}

/**
 * Creates an HTTP Request to be sent to a REST Access API.
 *
 * Supports the Fetch API on Web Browsers and Deno.
 * Uses the Node HTTP(S) standard libraries for Node.
 *
 * @param {String} hostname - Access API Hostname
 * @param {String} path - Path to the resource on the Access API
 * @param {String} method - HTTP Method
 * @param {Object} body - HTTP Request Body
 *
 * @returns JSON object response from Access API.
 */
export async function httpRequest({
  hostname,
  path,
  method,
  body,
  retryLimit = 5,
  retryIntervalMs = 1000,
}) {
  const isHTTPs = hostname.substring(0, 5) === "https"

  let fetchTransport
  try {
    fetchTransport = fetch || window?.fetch
  } catch (e) {}

  const {nodeHttpsTransport, nodeHttpTransport} = await getNodeHttpModules()

  invariant(
    fetchTransport || nodeHttpsTransport || nodeHttpTransport,
    "HTTP Request error: Could not find a supported HTTP module."
  )

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
    if (fetchTransport) {
      return fetchTransport(`${hostname}${path}`, {
        method: method,
        body: body ? JSON.stringify(body) : undefined,
      })
        .then(async res => {
          if (res.ok) {
            return res.json()
          }
          const responseJSON = await res.json()
          throw new HTTPRequestError({
            transport: "FetchTransport",
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
        .catch(e => {
          if (e instanceof HTTPRequestError) {
            throw e
          }
          throw new HTTPRequestError({
            transport: "FetchTransport",
            error: e?.message,
            hostname,
            path,
            method,
            requestBody: body,
          })
        })
    } else if (nodeHttpsTransport && nodeHttpTransport) {
      return new Promise((resolve, reject) => {
        const hostnameParts = hostname.split(":")
        const port = hostnameParts.length == 3 ? hostnameParts[2] : undefined

        let parsedHostname =
          hostnameParts.length > 1
            ? hostnameParts[1].substring(2)
            : hostnameParts[0]

        const transport = isHTTPs ? nodeHttpsTransport : nodeHttpTransport
        const bodyString = body ? JSON.stringify(body) : null

        const options = {
          hostname: parsedHostname,
          path,
          port,
          method,
          headers: body
            ? {
                "Content-Type": "application/json",
                "Content-Length": bodyString.length,
              }
            : undefined,
        }

        var responseBody = []
        const req = transport.request(options, res => {
          res.setEncoding("utf8")

          res.on("data", dataChunk => {
            responseBody.push(dataChunk)
          })

          res.on("end", () => {
            try {
              responseBody = JSON.parse(responseBody.join(""))
              if (
                res?.statusCode &&
                (Number(res?.statusCode) < 200 ||
                  Number(res?.statusCode) >= 300)
              ) {
                reject(
                  new HTTPRequestError({
                    transport: isHTTPs
                      ? "NodeHTTPsTransport"
                      : "NodeHTTPTransport",
                    error: JSON.stringify(responseBody),
                    hostname: parsedHostname,
                    path,
                    port,
                    method,
                    requestBody: body ? JSON.stringify(body) : null,
                    responseBody: JSON.stringify(responseBody),
                    reqOn: "end",
                    statusCode: res?.statusCode,
                  })
                )
              }
            } catch (e) {
              if (e instanceof HTTPRequestError) {
                reject(e)
              }
              reject(
                new HTTPRequestError({
                  transport: isHTTPs
                    ? "NodeHTTPsTransport"
                    : "NodeHTTPTransport",
                  error: e,
                  hostname: parsedHostname,
                  path,
                  port,
                  method,
                  requestBody: body ?? null,
                  responseBody: responseBody,
                  reqOn: "end",
                })
              )
            }
            resolve(responseBody)
          })
        })

        req.on("error", e => {
          reject(
            new HTTPRequestError({
              transport: isHTTPs ? "NodeHTTPsTransport" : "NodeHTTPTransport",
              error: e,
              hostname: parsedHostname,
              path,
              port,
              method,
              requestBody: body,
              responseBody,
              reqOn: "error",
            })
          )
        })

        if (body) req.write(bodyString)
        req.end()
      })
    }
  }

  // Keep retrying request until server available or max attempts exceeded
  return await requestLoop()
}
