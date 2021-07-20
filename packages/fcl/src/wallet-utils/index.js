export const sendMessage =
  (type, msg = {}) =>
  e => {
    e && e.preventDefault()
    if (window.location !== window.parent.location) {
      // The page is in an iFrame
      window.parent.postMessage({...msg, type}, "*")
    } else {
      // The page is not in an iFrame
      window.opener.postMessage({...msg, type}, "*")
    }
  }
