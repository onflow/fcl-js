import { keccak_256 } from "@noble/hashes/sha3";
import { arrayify, concat } from "@ethersproject/bytes";
import { _TypedDataEncoder as TypedDataEncoder } from "@ethersproject/hash";
import {TypedData} from "./types/eth"

/**
 * Hash for legacy `eth_signTypedData`
 * (Non‑EIP‑712 compliant; uses a simple JSON‑stringify)
 */
export function hashTypedDataLegacy(data: TypedData): string {
  const hash = keccak_256(Buffer.from(JSON.stringify(data), "utf8"));
  return "0x" + Buffer.from(hash).toString("hex");
}

/**
 * Hash for `eth_signTypedData_v3`
 *
 * Uses EIP‑712 encoding:
 *   digest = keccak_256( "\x19\x01" || domainSeparator || messageHash )
 */
export function hashTypedDataV3(data: TypedData): string {
  const domainSeparator = TypedDataEncoder.hashDomain(data.domain);

  const messageHash = TypedDataEncoder.hash(
    data.domain,
    data.types,
    data.message
  );
  // The EIP‑191 prefix is "0x1901".
  const prefix = "0x1901";

  const digest = keccak_256(
    concat([
      arrayify(prefix),
      arrayify(domainSeparator),
      arrayify(messageHash),
    ])
  );
  return "0x" + Buffer.from(digest).toString("hex");
}

/**
 * Hash for `eth_signTypedData_v4`
 *
 * For many cases, v3 and v4 yield the same result (if you’re not using arrays or nested dynamic types).
 */
export function hashTypedDataV4(data: TypedData): string {
  return hashTypedDataV3(data);
}
