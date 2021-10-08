import {get, isFn} from "../interaction/interaction.js"
import {createSignableVoucher} from "../resolve/voucher.js"

export async function resolvePreSendCheck(ix) {
  const fn = get(ix, "ix.pre-send-check")
  if (isFn(fn)) {
    await fn(createSignableVoucher(ix))
  }
  return ix
}
