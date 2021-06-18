import {isTransaction, isScript, get} from "../interaction/interaction.js"
import {invariant} from "@onflow/util-invariant"
import {config} from "../config"

const isFn = v => typeof v === "function"
const isString = v => typeof v === "string"

export async function resolveCadence(ix) {
  if (isTransaction(ix) || isScript(ix)) {
    var cadence = get(ix, "ix.cadence")
    invariant(
      isFn(cadence) || isString(cadence),
      "Cadence needs to be a function or a string."
    )
    if (isFn(cadence)) cadence = await cadence({})
    invariant(isString(cadence), "Cadence needs to be a string at this point.")
    ix.message.cadence = await config()
      .where(/^0x/)
      .then(d =>
        Object.entries(d).reduce(
          (cadence, [key, value]) => cadence.replace(key, value),
          cadence
        )
      )
  }

  return ix
}
