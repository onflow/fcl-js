import {get, isFn} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"
import {createSignableVoucher} from "./voucher"

/**
 * Resolves voucher intercept functions by calling them with the current voucher.
 *
 * @param ix The interaction object to resolve voucher intercepts for
 * @returns The interaction after voucher intercept processing
 */
export async function resolveVoucherIntercept(
  ix: Interaction
): Promise<Interaction> {
  const fn = get(ix, "ix.voucher-intercept")
  if (isFn(fn)) {
    await fn(createSignableVoucher(ix))
  }
  return ix
}
