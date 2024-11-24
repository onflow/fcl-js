import {
  FCL_REDIRECT_URL_PARAM_NAME,
  FCL_RESPONSE_PARAM_NAME,
} from "../utils/constants"
import {onMessageFromFCL} from "./on-message-from-fcl"
import {URL} from "../utils/url"

/**
 * @description
 * Sends message to FCL window
 *
 * @param {string} type - Message type
 * @param {object} msg - Message object
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
export const sendMsgToFCL = (type, msg = {}) => {
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
 * @description
 * Listens for "FCL:VIEW:READY:RESPONSE" and sends "FCL:VIEW:READY"
 *
 * @param {Function} cb - Callback function
 * @param {object} msg - Message object
 * @returns {void}
 */
export const ready = (cb, msg = {}) => {
  onMessageFromFCL("FCL:VIEW:READY:RESPONSE", cb)
  sendMsgToFCL("FCL:VIEW:READY")
}

/**
 * @description
 * Sends "FCL:VIEW:CLOSE"
 *
 * @returns {void}
 */
export const close = () => {
  sendMsgToFCL("FCL:VIEW:CLOSE")
}

/**
 * @description
 * Sends "FCL:VIEW:RESPONSE" with status "APPROVED"
 *
 * @param {object} data - Data object
 * @returns {void}
 */
export const approve = data => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    reason: null,
    data: data,
  })
}

/**
 * @description
 * Sends "FCL:VIEW:RESPONSE" with status "DECLINED"
 *
 * @param {string} reason - Reason for declining
 * @returns {void}
 */
export const decline = reason => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "DECLINED",
    reason: reason,
    data: null,
  })
}

/**
 * @description
 * Sends "FCL:VIEW:RESPONSE" with status "REDIRECT"
 *
 * @param {object} data - Data object
 * @returns {void}
 */
export const redirect = data => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "REDIRECT",
    reason: null,
    data: data,
  })
}
