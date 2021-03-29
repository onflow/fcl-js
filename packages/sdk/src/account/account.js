import {getAccount} from "../build/build-get-account.js"
import {decodeResponse as decode} from "../decode/decode.js"
import {send} from "../send/send.js"

export function account(address, opts) {
  return send([getAccount(address)], opts).then(decode)
}
