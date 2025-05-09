import {put, InteractionBuilderFn} from "../interaction/interaction"
import {Voucher} from "../encode/encode"

type VoucherInterceptFn = (voucher: Voucher) => any | Promise<any>

/**
 * @description A builder function that intercepts and modifies a voucher
 * @param fn The function to intercept and modify the voucher
 * @returns A function that processes an interaction object
 */
export function voucherIntercept(fn: VoucherInterceptFn): InteractionBuilderFn {
  return put("ix.voucher-intercept", fn)
}
