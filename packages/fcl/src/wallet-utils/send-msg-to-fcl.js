export const sendMsgToFCL = (type, msg = {}) => {
  if (window.location !== window.parent.location) {
    window.parent.postMessage({...msg, type}, "*")
  } else {
    window.opener.postMessage({...msg, type}, "*")
  }
}
