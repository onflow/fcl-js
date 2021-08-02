export const onMessageFromFCL = (msg, cb = () => {}) => {
  const internal = e => {
    if (typeof e.data !== "object") return
    if (e.data.type !== msg) return
    delete e.data.body.interaction

    cb(e.data)
  }
  window.addEventListener("message", internal)
  return () => window.removeEventListener("message", internal)
}
