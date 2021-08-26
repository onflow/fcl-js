export const onMessageFromFCL = (messageType, cb = () => {}) => {
  const buildData = data => {
    if (data.deprecated)
      console.warn("DEPRECATION NOTICE", data.deprecated.message)
    delete data?.body?.interaction

    return data
  }

  const internal = e => {
    const {data} = e
    if (typeof data !== "object") return
    if (typeof data == null) return
    if (data.type !== messageType) return

    cb(buildData(data))
  }

  window.addEventListener("message", internal)
  return () => window.removeEventListener("message", internal)
}
