import {put, InteractionCallback} from "../interaction/interaction"

/**
 * @description A builder function that intercepts and modifies a voucher
 * @param fn The function to intercept and modify the voucher
 * @returns A function that processes an interaction object
 */
export function voucherIntercept(fn: Function): InteractionCallback {
  return put("ix.voucher-intercept", fn)
}
