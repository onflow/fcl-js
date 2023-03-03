import {atBlockHeight} from "../build/build-at-block-height.js"
import {atBlockId} from "../build/build-at-block-id.js"
import {getAccount} from "../build/build-get-account.js"
import {invariant} from "@onflow/util-invariant"
import {decodeResponse as decode} from "../decode/decode.js"
import {send} from "../send/send.js"

/**
 * @typedef {object} AccountObject
 * @property {string} address - The address of the account
 * @property {number} balance - The FLOW balance of the account in 10^8
 * @property {number} code - The code of any Cadence contracts stored in the account
 * @property {contracts} contracts - An object with keys as the contract name deployed and the value as the the cadence string
 * @property {object} keys - Any contracts deployed to this account
 */

/**
 * @description  Returns the details of an account from their public address
 * @param {string} address - Address of the account
 * @param {object} [queryOptions] - Query parameters
 * @param {number} [queryOptions.height] - Block height to query
 * @param {string} [queryOptions.id] - Block ID to query
 * @param {object} [opts] - Optional parameters
 * @returns {Promise<AccountObject>} - A promise that resolves to an account response
 */
export function account(address, {height, id} = {}, opts) {
  invariant(
    !(id && height),
    `Method: account -- Cannot pass "id" and "height" simultaneously`
  )

  // Get account by ID
  if (id) return send([getAccount(address), atBlockId(id)], opts).then(decode)

  // Get account by height
  if (height)
    return send([getAccount(address), atBlockHeight(height)], opts).then(decode)

  return send([getAccount(address)], opts).then(decode)
}
