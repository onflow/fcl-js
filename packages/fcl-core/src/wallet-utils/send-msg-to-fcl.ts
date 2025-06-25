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
 * @description Sends messages from a wallet or service back to the parent FCL application. This function
 * handles communication between wallet UIs (running in iframes, popups, or redirects) and the main FCL
 * application. It automatically detects the communication method (redirect, iframe, or popup) and sends
 * the message accordingly.
 *
 * @param type The message type identifier (e.g., "FCL:VIEW:RESPONSE", "FCL:VIEW:READY")
 * @param msg Optional message payload containing response data
 * @param msg.f_type FCL message format type, should be "PollingResponse"
 * @param msg.f_vsn FCL message format version, should be "1.0.0"
 * @param msg.status Response status
 * @param msg.reason Reason for the response (especially for DECLINED status)
 * @param msg.data Actual response data (signatures, account info, etc.)
 *
 * @throws When unable to communicate with parent FCL instance
 *
 * @example
 * // Send approval response with signature data
 * import { sendMsgToFCL } from "@onflow/fcl"
 *
 * sendMsgToFCL("FCL:VIEW:RESPONSE", {
 *   f_type: "CompositeSignature",
 *   f_vsn: "1.0.0",
 *   addr: "0x1234567890abcdef",
 *   keyId: 0,
 *   signature: "abc123..."
 * })
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
 * @description Initiates the communication handshake between a wallet service and FCL. This function
 * listens for the "FCL:VIEW:READY:RESPONSE" message from FCL and automatically sends "FCL:VIEW:READY"
 * to indicate the wallet service is ready to receive requests. This is typically the first function
 * called when a wallet service loads.
 *
 * @param cb Callback function executed when FCL responds with ready confirmation
 * @param cb.data Data received from FCL ready response
 * @param cb.context Context object containing origin information
 * @param cb.context.origin Origin of the FCL application
 * @param msg Optional message payload to include with ready signal
 *
 * @example
 * // Basic wallet service initialization
 * import { ready } from "@onflow/fcl"
 *
 * ready((data, context) => {
 *   console.log("FCL is ready to communicate")
 *   console.log("FCL origin:", context.origin)
 *   console.log("Ready data:", data)
 *
 *   // Wallet service is now ready to handle authentication requests
 *   initializeWalletUI()
 * })
 */
export const ready = (
  cb: (data: any, context: {origin: string}) => void,
  msg: PollingResponse = {} as PollingResponse
): void => {
  onMessageFromFCL("FCL:VIEW:READY:RESPONSE", cb)
  sendMsgToFCL("FCL:VIEW:READY")
}

/**
 * @description Closes the wallet service window/iframe and notifies FCL that the service is shutting down.
 * This should be called when the user cancels an operation or when the wallet service needs to close itself.
 *
 * Sends "FCL:VIEW:CLOSE".
 */
export const close = (): void => {
  sendMsgToFCL("FCL:VIEW:CLOSE")
}

/**
 * @description Sends an approval response to FCL with the provided data. This indicates that the user
 * has approved the requested operation (authentication, transaction signing, etc.) and includes the
 * resulting data (signatures, account information, etc.).
 *
 * Sends "FCL:VIEW:RESPONSE". with status "APPROVED".
 *
 * @param data The approval data to send back to FCL (signatures, account info, etc.)
 *
 * @example
 * // Approve authentication with account data
 * import { approve } from "@onflow/fcl"
 *
 * const accountData = {
 *   f_type: "AuthnResponse",
 *   f_vsn: "1.0.0",
 *   addr: "0x1234567890abcdef",
 *   services: [
 *     {
 *       f_type: "Service",
 *       f_vsn: "1.0.0",
 *       type: "authz",
 *       method: "HTTP/POST",
 *       endpoint: "https://wallet.example.com/authz"
 *     }
 *   ]
 * }
 *
 * approve(accountData)
 */
export const approve = (data: any): void => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    reason: null,
    data: data,
  })
}

/**
 * @description Sends a decline response to FCL indicating that the user has rejected or cancelled
 * the requested operation. This should be called when the user explicitly cancels an operation
 * or when an error prevents the operation from completing.
 *
 * Sends "FCL:VIEW:RESPONSE". with status "DECLINED".
 *
 * @param reason Human-readable reason for declining the request
 *
 * @example
 * // Decline when user cancels authentication
 * import { decline } from "@onflow/fcl"
 *
 * document.getElementById('cancel-btn').addEventListener('click', () => {
 *   decline("User cancelled authentication")
 * })
 */
export const decline = (reason: string): void => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "DECLINED",
    reason: reason,
    data: null,
  })
}

/**
 * @description Sends a redirect response to FCL indicating that the operation requires a redirect
 * to complete. This is used when the wallet service needs to redirect the user to another URL
 * (such as a native app deep link or external service).
 *
 * Sends "FCL:VIEW:RESPONSE". with status "REDIRECT".
 *
 * @param data Redirect data containing the target URL and any additional parameters
 *
 * @example
 * // Redirect to native wallet app
 * import { redirect } from "@onflow/fcl"
 *
 * redirect({
 *   f_type: "RedirectResponse",
 *   f_vsn: "1.0.0",
 *   url: "flow-wallet://sign?transaction=abc123",
 *   callback: "https://myapp.com/callback"
 * })
 */
export const redirect = (data: any): void => {
  sendMsgToFCL("FCL:VIEW:RESPONSE", {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "REDIRECT",
    reason: null,
    data: data,
  })
}
