import {onMessageFromFCL} from "./on-message-from-fcl"

/**
 * @description
 * Sends message to FCL window
 * 
 * @param {string} type - Message type
 * @param {Object} msg - Message object
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
  if (window.location !== window.parent.location) {
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
 * @param {Object} msg - Message object
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
 * @param {Object} data - Data object
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
 * @param {Object} data - Data object
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
