import {put} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

/**
 * @description - A builder function that intercepts and modifies a voucher
 * @param fn - The function to intercept and modify the voucher
 * @returns A function that processes an interaction object
 */
export function voucherIntercept(
  fn: Function
): (ix: Interaction) => Interaction {
  return put("ix.voucher-intercept", fn)
}
