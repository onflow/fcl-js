import {get, isFn} from "../interaction/interaction.js"
import {createSignableVoucher} from "./voucher.js"

export async function resolveVoucherIntercept(ix) {
  const fn = get(ix, "ix.voucher-intercept")
  if (isFn(fn)) {
    await fn(createSignableVoucher(ix))
  }
  return ix
}
