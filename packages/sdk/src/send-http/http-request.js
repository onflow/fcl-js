import {invariant} from "@onflow/util-invariant"

export async function httpRequest({
  hostname,
  port = 443,
  path,
  method,
  body,
}) {
  const fetchTransport = fetch || window?.fetch
  const nodeHttpsTransport = await import("https").catch(e => undefined)

  invariant((fetchTransport || nodeHttpsTransport), "HTTP Request error: Could not find a supported http module.")

  if (fetchTransport) {

    return await fetchTransport(
      hostname + path,
      {
        method: method,
        body: body,
      }
    ).then(res => res.json())

  } else if (nodeHttpsTransport) {

    return new Promise((resolve, reject) => {

      const options = {
        hostname,
        port,
        path,
        method,
        headers: body ? {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        } : undefined
      }

      const req = nodeHttpsTransport.request(options, (res) => {
        var body = []
        
        res.on("data", body.push)

        res.on("end", () => {
          try {
            body = JSON.parse(Buffer.concat(body).toString());
          } catch(e) {
              reject(e);
          }
          resolve(body);
        })
      })

      req.on("error", reject)
      
      if (body) req.write(JSON.stringify(body))
      req.end()

    })
  }
}
