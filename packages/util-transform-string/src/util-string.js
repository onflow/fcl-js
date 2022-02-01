import { invariant } from "@onflow/util-invariant"

function uInt8Array_to_hex(uInt8Array) {
  return [...uInt8Array]
      .map(x => x.toString(16).padStart(2, "0"))
      .join('')
}

// utf8
export function utf8_to_hex(inputString) {
  if (window?.btoa && window?.TextEncoder)
    return uInt8Array_to_hex(new window.TextEncoder().encode(inputString))
  if (Buffer) return Buffer.from(inputString).toString("hex")

  invariant(true, "Util-String Error: No supported encoding strategy found.")
}

export function utf8_to_base64(inputString) {
  if (window?.btoa) return window.btoa(inputString)
  if (Buffer) return Buffer.from(inputString).toString("base64")

  invariant(true, "Util-String Error: No supported encoding strategy found.")
} 

// hex
export function hex_to_utf8(inputString) {
  if (window?.decodeURIComponent)
    return window?.decodeURIComponent(inputString.replace(/../g, '%$&'))
  if (Buffer) return Buffer.from(inputString, "hex").toString()

  invariant(true, "Util-String Error: No supported encoding strategy found.")
}

export function hex_to_base64(inputString) {
  if (window?.decodeURIComponent && window?.btoa)
    return window?.btoa(window.decodeURIComponent(inputString.replace(/../g, '%$&')))
  if (Buffer) return Buffer.from(inputString, "hex").toString("base64")

  invariant(true, "Util-String Error: No supported encoding strategy found.")
}

// base64
export function base64_to_utf8(inputString) { 
  if (window?.atob) return window?.atob(inputString)
  if (Buffer) return Buffer.from(inputString, "base64").toString("utf-8")

  invariant(true, "Util-String Error: No supported encoding strategy found.")
}

export function base64_to_hex(inputString) {
  if (window?.atob && window?.TextEncoder) return uInt8Array_to_hex(new window.TextEncoder().encode(window?.atob(inputString)))
  if (Buffer) return Buffer.from(inputString, "base64").toString("hex")

  invariant(true, "Util-String Error: No supported encoding strategy found.")
}