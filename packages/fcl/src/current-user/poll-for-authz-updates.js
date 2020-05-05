import {fetchHook} from "./fetch-hook"

export const pollForAuthzUpdates = hook =>
  new Promise(async (resolve, reject) => {
    const resp = await fetchHook(hook)

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
