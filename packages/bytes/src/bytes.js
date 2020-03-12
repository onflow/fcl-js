function createPaddedBuffer(src, length) {
  const dst = Buffer.alloc(length)
  src.copy(dst, length - src.length, 0, src.length)
  return dst
}

export const bytes = (bytes, length) => {
  let buffer = bytes
  if (typeof bytes === "string") {
    buffer = Buffer.from(bytes, "hex")
  } else if (bytes instanceof Uint8Array) {
    buffer = Buffer.from(bytes)
  }

  if (length !== undefined) {
    buffer = createPaddedBuffer(buffer, length)
  }

  return buffer
}

export const bytesToString = bytes => bytes.toString("utf8")
export const bytesToHex = bytes => bytes.toString("hex")
export const bytesToBuffer = bytes => Buffer.from(bytes)

export const addressToBuffer = address => bytesToBuffer(address, 20)
export const scriptToBuffer = script => Buffer.from(script, "utf8")
export const keyToBuffer = key => Buffer.from(key, "hex")
export const hashToBuffer = hash => Buffer.from(hash, "hex")

export const bufferToHexString = buffer =>
  buffer.reduce(
    (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
    ""
  )
