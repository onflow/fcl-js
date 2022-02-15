import {sansPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {encode as rlpEncode} from "@onflow/rlp"

const rightPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padEnd(pad * 2, 0), "hex")

const leftPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padStart(pad * 2, 0), "hex")

const addressBuffer = addr => leftPaddedHexBuffer(addr, 8)

export const encodeMessageForProvableAuthnVerifying = (
  address,
  timestamp,
  appDomainTag = ""
) => {
  invariant(
    address,
    "Encode Message For Provable Authn Error: address must be defined"
  )
  invariant(
    timestamp,
    "Encode Message For Provable Authn Error: timestamp must be defined"
  )

  const APP_DOMAIN_TAG = appDomainTag
    ? rightPaddedHexBuffer(Buffer.from(appDomainTag).toString("hex"), 32)
    : null

  return (
    appDomainTag
      ? rlpEncode([
          APP_DOMAIN_TAG,
          addressBuffer(sansPrefix(address)),
          timestamp,
        ])
      : rlpEncode([addressBuffer(sansPrefix(address)), timestamp])
  ).toString("hex")
}
