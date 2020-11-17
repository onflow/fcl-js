import {getAccount} from "@onflow/sdk-build-get-account"
import {decode} from "@onflow/sdk-decode"
import {send} from "@onflow/sdk-send"

export function account(address, opts) {
  return send([getAccount(address)], opts).then(decode)
}
