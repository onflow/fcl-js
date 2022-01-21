import {invariant} from "@onflow/util-invariant"

class HTTPRequestError extends Error {
  constructor({transport, error, hostname, path, port, method, requestBody, responseBody, responseStatusText, reqOn}) {
    const msg = `
      HTTP Request Error: An error occurred when interacting with the Access API.
      transport=${transport}
      error=${error}
      hostname=${hostname}
      path=${path}
      port=${port}
      method=${method}
      requestBody=${JSON.stringify(requestBody)}
      responseBody=${responseBody}
      responseStatusText=${responseStatusText}
      reqOn=${reqOn}
    `
    super(msg)
    this.name = "HTTP Request Error"
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
}) {
  const isHTTPs = hostname.substring(0, 5) === "https"

  let fetchTransport
  try {
    fetchTransport = window?.fetch || fetch
  } catch (e) {}
  let nodeHttpsTransport
  try {
    nodeHttpsTransport = await import("https").catch(_ => undefined)
  } catch (e) {}
  let nodeHttpTransport
  try {
    nodeHttpTransport = await import("http").catch(_ => undefined)
  } catch (e) {}

  invariant((fetchTransport || nodeHttpsTransport), "HTTP Request error: Could not find a supported HTTP module.")

  if (fetchTransport) {

    return await fetchTransport(
      `${hostname}${path}`,
      {
        method: method,
        body: body ? JSON.stringify(body) : undefined,
      }
    ).then(res => {
      if (res.ok) {
        return res.json()
      }
      throw new HTTPRequestError({
        transport: "FetchTransport",
        error: e,
        hostname,
        path,
        method,
        requestBody: body,
        responseBody: res.json(),
        responseStatusText: res.statusText
      })
    }).catch(e => {
      throw new HTTPRequestError({
        transport: "FetchTransport",
        error: e,
        hostname,
        path,
        method,
        requestBody: body
      })
    })

  } else if (nodeHttpsTransport && nodeHttpTransport) {

    return new Promise((resolve, reject) => {

      const hostnameParts = hostname.split(":")
      const port = hostnameParts.length == 3 ? hostnameParts[2] : undefined

      let parsedHostname = hostnameParts.length > 1 ? hostnameParts[1].substring(2) : hostnameParts[0]

      const transport = isHTTPs ? nodeHttpsTransport : nodeHttpTransport
      const bodyString = body ? JSON.stringify(body) : null

      const options = {
        hostname: parsedHostname,
        path,
        port,
        method,
        headers: body ? {
          "Content-Type": "application/json",
          "Content-Length": bodyString.length
        } : undefined
      }

      var responseBody = []
      const req = transport.request(options, (res) => {
        res.setEncoding('utf8');
        
        res.on("data", dataChunk => {
          responseBody.push(dataChunk)
        })

        res.on("end", () => {
          try {
            responseBody = JSON.parse(responseBody.join(""))
          } catch(e) {
            reject(new HTTPRequestError({
              transport: isHTTPs ? "NodeHTTPsTransport" : "NodeHTTPTransport",
              error: e,
              hostname: parsedHostname,
              path,
              port,
              method,
              requestBody: body,
              responseBody,
              reqOn: "end",
            }))
          }
          resolve(responseBody)
        })
      })

      req.on("error", e => {
        reject(new HTTPRequestError({
          transport: isHTTPs ? "NodeHTTPsTransport" : "NodeHTTPTransport",
          error: e,
          hostname: parsedHostname,
          path,
          port,
          method,
          requestBody: body,
          responseBody,
          reqOn: "error",
        }))
      })
      
      if (body) req.write(bodyString)
      req.end()

    })
  }
}
