import {withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {encode} from '@onflow/rlp';

export const encodeMessageFromProvableAuthn = (address, timestamp, appTag = "") => {
    invariant(address, "Encode Message From Provable Authn Error: address must be defined")
    invariant(timestamp, "Encode Message From Provable Authn Error: timestamp must be defined")

    return encode([appTag, withPrefix(address), timestamp]).toString("hex")
}
