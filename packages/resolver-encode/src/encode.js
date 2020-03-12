import {pipe} from "@qvvg/mario"
import {encodeCode} from "./encode-code"
import {encodePayload} from "./encode-payload"
import {encodeHash} from "./encode-hash"
import {encodeAddress} from "./encode-address"
import {encodeEventType} from "./encode-event-type"
import {encodeStartBlock} from "./encode-start-block"
import {encodeEndBlock} from "./encode-end-block"
import {encodeIsSealed} from "./encode-is-sealed"
import {encodeComputeLimit} from "./encode-compute-limit"
import {encodeNonce} from "./encode-nonce"
import {encodePayerAuthorization} from "./encode-payer-authorization"
import {encodeAuthorizations} from "./encode-authorizations"
import {encodeReferenceBlockHash} from "./encode-reference-block-hash"

export const encode = pipe([
  encodeAuthorizations,
  encodeReferenceBlockHash,
  encodeCode,
  encodeHash,
  encodeAddress,
  encodeEventType,
  encodeStartBlock,
  encodeEndBlock,
  encodeIsSealed,
  encodeComputeLimit,
  encodeNonce,
  encodePayerAuthorization,
  encodePayload,
])
