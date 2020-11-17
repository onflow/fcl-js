import {send} from "@onflow/sdk-send"
import {getLatestBlock} from "@onflow/sdk-build-get-latest-block"
import {decode} from "@onflow/sdk-decode"

export function latestBlock(opts = {}) {
  return send([getLatestBlock()], opts).then(decode)
}
