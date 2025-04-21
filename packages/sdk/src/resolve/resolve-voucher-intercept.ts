import {get, isFn} from "../interaction/interaction"
import {Interaction} from "../types"
import {createSignableVoucher} from "./voucher"

export async function resolveVoucherIntercept(
  ix: Interaction
): Promise<Interaction> {
  const fn = get(ix, "ix.voucher-intercept", null)
  if (isFn(fn)) {
    await fn(createSignableVoucher(ix))
  }
  return ix
}
