/**
 * @description
 * Listens for messages from FCL
 *
 * @param messageType Message type
 * @param cb Callback function
 * @returns Function to remove event listener
 */
export const onMessageFromFCL = (
  messageType: string,
  cb: (data: any, context: {origin: string}) => void = () => {}
): (() => void) => {
  const buildData = (data: any): any => {
    if (data.deprecated)
      console.warn("DEPRECATION NOTICE", data.deprecated.message)
    delete data?.body?.interaction

    return data
  }

  const internal = (e: MessageEvent): void => {
    const {data, origin} = e
    if (typeof data !== "object") return
    if (typeof data == null) return
    if (data.type !== messageType) return

    cb(buildData(data), {origin})
  }

  window.addEventListener("message", internal)
  return () => window.removeEventListener("message", internal)
}
