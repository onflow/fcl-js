/**
 * @description Sets up a message listener to receive messages from the parent FCL application. This
 * function is used by wallet services to listen for specific message types from FCL and respond
 * accordingly. It handles message filtering, data sanitization, and provides context about the
 * message origin for security purposes.
 *
 * @param messageType The specific message type to listen for (e.g., "FCL:VIEW:READY:RESPONSE")
 * @param cb Callback function executed when a matching message is received
 * @param cb.data The message data received from FCL, with deprecated fields removed
 * @param cb.context Context object providing security information
 * @param cb.context.origin The origin URL of the FCL application sending the message
 *
 * @returns Function to remove the event listener and stop listening for messages
 *
 * @example
 * // Listen for authentication requests from FCL
 * import { onMessageFromFCL } from "@onflow/fcl"
 *
 * const removeListener = onMessageFromFCL("FCL:VIEW:READY:RESPONSE", (data, context) => {
 *   console.log("FCL is ready for communication")
 *   console.log("Message from:", context.origin)
 *   console.log("Ready data:", data)
 *
 *   // Verify origin for security
 *   if (context.origin === "https://myapp.com") {
 *     initializeWalletServices()
 *   } else {
 *     console.warn("Unexpected origin:", context.origin)
 *   }
 * })
 *
 * // Stop listening when wallet service closes
 * window.addEventListener("beforeunload", () => {
 *   removeListener()
 * })
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
