import {urlFromService} from "./url-from-service"

const METHODS = {
  "HTTP/GET": "GET",
  "HTTP/POST": "POST",
}

export const pollForAuthzUpdates = service =>
  new Promise(async (resolve, reject) => {
    const resp = await fetch(urlFromService(service), {
      method: METHODS[service.method],
      headers: {
        "Content-Type": "application/json",
      },
    }).then(d => d.json())

    if (resp.status === "APPROVED") {
      resolve(resp.compositeSignature)
    } else if (resp.status === "DECLINED") {
      reject({status: resp.status, reason: resp.reason})
    } else {
      setTimeout(() => {
        resolve(pollForAuthzUpdates(resp.authorizationUpdates))
      }, 500)
    }
  })
