import {pipe, put, Ok, makeTransaction} from "../interaction/interaction"
import {template} from "@onflow/util-template"

const DEFAULT_SCRIPT_ACCOUNTS = []
const DEFUALT_REF = null

/**
 * @description - A template builder to use a Cadence transaction for an interaction
 * @param {...*} args - The arguments to pass
 * @returns {Function} - An interaction object
 */
export function transaction(...args) {
  return pipe([
    makeTransaction,
    put("ix.cadence", template(...args)),
    ix => {
      ix.message.refBlock = ix.message.refBlock || DEFUALT_REF
      ix.authorizations = ix.authorizations || DEFAULT_SCRIPT_ACCOUNTS
      return Ok(ix)
    },
  ])
}
