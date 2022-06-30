import {onMessageFromFCL} from "./on-message-from-fcl"

export const sendMsgToFCL = (type, msg = {}) => {
  if (window.location !== window.parent.location) {
    window.parent.postMessage({...msg, type}, "*")
  } else if (window.opener) {
    window.opener.postMessage({...msg, type}, "*")
  } else {
    throw new Error("Unable to communicate with parent FCL instance")
  }
}

export const ready = (cb, msg = {}) => {
  onMessageFromFCL("FCL:VIEW:READY:RESPONSE", cb)
  sendMsgToFCL("FCL:VIEW:READY")
}

export const close = () => {
  sendMsgToFCL("FCL:VIEW:CLOSE")
}

export const approve = data => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    reason: null,
    data: data,
  })
}

export const decline = reason => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "DECLINED",
    reason: reason,
    data: null,
  })
}

export const redirect = data => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "REDIRECT",
    reason: null,
    data: data,
  })
}
