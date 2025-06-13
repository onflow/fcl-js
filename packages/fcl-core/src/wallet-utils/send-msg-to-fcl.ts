import {
  FCL_REDIRECT_URL_PARAM_NAME,
  FCL_RESPONSE_PARAM_NAME,
} from "../utils/constants"
import {onMessageFromFCL} from "./on-message-from-fcl"

export interface PollingResponse {
  f_type: "PollingResponse"
  f_vsn: "1.0.0"
  status: "APPROVED" | "DECLINED" | "REDIRECT"
  reason: string | null
  data: any
}

/**
 * @description Sends message to FCL window
 *
 * @param {string} type Message type
 * @param {PollingResponse} msg Message object
 * @returns {void}
 *
 * @example
 * sendMsgToFCL("FCL:VIEW:RESPONSE", {
 *    f_type: "PollingResponse",
 *    f_vsn: "1.0.0",
 *    status: "APPROVED",
 *    reason: null,
 *    data: data,
 *  })
 */
export const sendMsgToFCL = (type: string, msg?: PollingResponse): void => {
  const data = {...msg, type}

  const urlParams = new URLSearchParams(window.location.search)
  const redirectUrl = urlParams.get(FCL_REDIRECT_URL_PARAM_NAME)
  if (redirectUrl) {
    const url = new URL(redirectUrl)
    url.searchParams.append(FCL_RESPONSE_PARAM_NAME, JSON.stringify(data))
    window.location.href = url.href
  } else if (window.location !== window.parent.location) {
    window.parent.postMessage({...msg, type}, "*")
  } else if (window.opener) {
    window.opener.postMessage({...msg, type}, "*")
  } else {
    throw new Error("Unable to communicate with parent FCL instance")
  }
}

/**
 * @description Listens for "FCL:VIEW:READY:RESPONSE" and sends "FCL:VIEW:READY"
 *
 * @param cb Callback function
 * @param msg Message object
 */
export const ready = (
  cb: (data: any, context: {origin: string}) => void,
  msg: PollingResponse = {} as PollingResponse
): void => {
  onMessageFromFCL("FCL:VIEW:READY:RESPONSE", cb)
  sendMsgToFCL("FCL:VIEW:READY")
}

/**
 * @description Sends "FCL:VIEW:CLOSE"
 *
 * @returns {void}
 */
export const close = (): void => {
  sendMsgToFCL("FCL:VIEW:CLOSE")
}

/**
 * @description Sends "FCL:VIEW:RESPONSE" with status "APPROVED"
 *
 * @param {object} data Data object
 * @returns {void}
 */
export const approve = (data: any): void => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    reason: null,
    data: data,
  } as PollingResponse)
}

/**
 * @description Sends "FCL:VIEW:RESPONSE" with status "DECLINED"
 *
 * @param {string} reason Reason for declining
 * @returns {void}
 */
export const decline = (reason: string): void => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "DECLINED",
    reason: reason,
    data: null,
  } as PollingResponse)
}

/**
 * @description Sends "FCL:VIEW:RESPONSE" with status "REDIRECT"
 *
 * @param {object} data Data object
 * @returns {void}
 */
export const redirect = (data: any): void => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "REDIRECT",
    reason: null,
    data: data,
  } as PollingResponse)
}
