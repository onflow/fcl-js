import {put} from "../interaction/interaction"

export function voucherIntercept(fn) {
  return put("ix.voucher-intercept", fn)
}
