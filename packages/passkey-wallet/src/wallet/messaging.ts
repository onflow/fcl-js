export type FclViewReadyResponse = {
  type: "FCL:VIEW:READY:RESPONSE"
  body?: any
  data?: any
  params?: any
}

const postToParent = (type: string, body?: any) => {
  const message = body ? {type, ...body} : {type}
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(message, "*")
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, "*")
    }
  } catch {}
}

export const ready = () => {
  postToParent("FCL:VIEW:READY")
}

export const approve = (data: any) => {
  postToParent("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    reason: null,
    data,
  })
}

export const decline = (reason: string) => {
  postToParent("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "DECLINED",
    reason,
  })
}

export const close = () => postToParent("FCL:VIEW:CLOSE")
