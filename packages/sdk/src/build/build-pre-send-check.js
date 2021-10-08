import {put} from "../interaction/interaction.js"

export function preSendCheck(fn) {
  return put('ix.pre-send-check', fn)
}
