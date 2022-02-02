import {put} from "../interaction/interaction.js"

export function voucherIntercept(fn) {
  return put("ix.voucher-intercept", fn)
}
