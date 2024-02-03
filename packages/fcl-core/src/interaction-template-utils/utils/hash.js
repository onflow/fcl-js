import {SHA3} from "sha3"
import {Buffer} from "@onflow/rlp"

export function genHash(utf8String) {
  const sha = new SHA3(256)
  sha.update(Buffer.from(utf8String, "utf8"))
  return sha.digest("hex")
}
