import {SERVICE_PRAGMA} from "./__vsn"

// {
//    "f_type": "Service",
//    "f_vsn": "1.0.0",
//    type: "local-view",
//    method: "VIEW/IFRAME",
//    endpoint: "https://woot.org/authz/local",
//    data: {},
//    params: {},
// }
export function normalizeLocalView(resp) {
  if (resp == null) return null
  if (resp.method == null) {
    resp = {...resp, type: "local-view", method: "VIEW/IFRAME"}
  }

  if (!resp["f_vsn"]) {
    return {
      ...SERVICE_PRAGMA,
      type: resp.type || "local-view",
      method: resp.method,
      endpoint: resp.endpoint,
      data: resp.data || {},
      params: resp.params || {},
    }
  }

  switch (resp["f_vsn"]) {
    case "1.0.0":
      return resp

    default:
      return null
  }
}
