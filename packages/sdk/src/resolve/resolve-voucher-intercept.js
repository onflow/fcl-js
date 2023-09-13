import {get, isFn} from "../interaction/interaction"
import {createSignableVoucher} from "./voucher"

export async function resolveVoucherIntercept(ix) {
  const fn = get(ix, "ix.voucher-intercept")
  if (isFn(fn)) {
    await fn(createSignableVoucher(ix))
  }
  return ix
}
