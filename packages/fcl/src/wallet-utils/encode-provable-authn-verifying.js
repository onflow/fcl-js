import {withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {encode} from '@onflow/rlp'

const rightPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padEnd(pad * 2, 0), "hex")

export const encodeMessageForProvableAuthnVerifying = (address, timestamp, appTag = "") => {
    invariant(address, "Encode Message From Provable Authn Error: address must be defined")
    invariant(timestamp, "Encode Message From Provable Authn Error: timestamp must be defined")

    const APP_DOMAIN_TAG = appTag ? rightPaddedHexBuffer(Buffer.from(appTag).toString("hex"), 32).toString("hex") : null

    return encode([APP_DOMAIN_TAG, withPrefix(address), timestamp]).toString("hex")
}
