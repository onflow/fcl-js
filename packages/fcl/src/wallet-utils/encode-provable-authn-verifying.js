import {Buffer} from "buffer"
import {withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {encode} from '@onflow/rlp'

const rightPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padEnd(pad * 2, 0), "hex")

export const encodeMessageForProvableAuthnVerifying = (address, timestamp, appDomainTag = "") => {
    invariant(address, "Encode Message From Provable Authn Error: address must be defined")
    invariant(timestamp, "Encode Message From Provable Authn Error: timestamp must be defined")

    const APP_DOMAIN_TAG = appDomainTag ? rightPaddedHexBuffer(Buffer.from(appDomainTag).toString("hex"), 32).toString("hex") : null

    return (appDomainTag ? 
      encode([APP_DOMAIN_TAG, withPrefix(address), timestamp]).toString("hex")
      :
      encode([withPrefix(address), timestamp]).toString("hex")
    )
}
