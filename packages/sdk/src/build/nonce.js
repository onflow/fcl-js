import {pipe} from "@qvvg/mario"
import {put} from "@onflow/assigns"

export const nonce = nonce => pipe([put("nonce", nonce)])
