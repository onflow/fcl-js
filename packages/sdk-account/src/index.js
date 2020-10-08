import {getAccount} from "@onflow/sdk-build-get-account"
import {decode} from "@onflow/sdk-decode"
import {send} from "@onflow/sdk-send"

export function account (address) {
  return send([getAccount(address)]).then(decode)
}
