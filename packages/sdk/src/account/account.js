import {atBlockHeight} from "../build/build-at-block-height.js"
import {atBlockId} from "../build/build-at-block-id.js"
import {atLatestBlock} from "../build/build-at-latest-block.js"
import {getAccount} from "../build/build-get-account.js"
import {invariant} from "@onflow/util-invariant"
import {decodeResponse as decode} from "../decode/decode.js"
import {send} from "../transport"

/**
 * @typedef {import("@onflow/typedefs").Account} Account
 */

/**
 * @description  Returns the details of an account from their public address
 * @param {string} address - Address of the account
 * @param {object} [queryOptions] - Query parameters
 * @param {number} [queryOptions.height] - Block height to query
 * @param {string} [queryOptions.id] - Block ID to query
 * @param {boolean} [queryOptions.isSealed] - Block finality
 * @param {object} [opts] - Optional parameters
 * @returns {Promise<Account>} - A promise that resolves to an account response
 */
export async function account(address, {height, id, isSealed} = {}, opts) {
  invariant(
    !((id && height) || (id && isSealed) || (height && isSealed)),
    `Method: account -- Only one of the following parameters can be provided: id, height, isSealed`
  )

  // Get account by ID
  if (id)
    return await send([getAccount(address), atBlockId(id)], opts).then(decode)

  // Get account by height
  if (height)
    return await send([getAccount(address), atBlockHeight(height)], opts).then(
      decode
    )

  // Get account by latest block
  return await send(
    [getAccount(address), opts.isSealed != null && atLatestBlock(isSealed)],
    opts
  ).then(decode)
}
