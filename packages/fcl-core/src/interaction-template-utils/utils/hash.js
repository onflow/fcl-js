import {sha3_256} from "@noble/hashes/sha3"
import {utf8ToBytes, bytesToHex} from "@noble/hashes/utils"

export function genHash(utf8String) {
  return bytesToHex(sha3_256(utf8ToBytes(utf8String)))
}
