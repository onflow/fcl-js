import {isTransaction, isScript, get} from "../interaction/interaction.js"
import {invariant} from "@onflow/util-invariant"
import {config} from "@onflow/config"
import {sansPrefix} from "@onflow/util-address"

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
        Object.entries(d).reduce((cadence, [key, value]) => {
          // config.load let's you write 'import HelloWorld from HelloWorld' but under the hood stores them with 0x to identify contracts
          const regexWithoutPrefix = new RegExp("(?<=\\bfrom\\s)" + sansPrefix(key), "g")
          // Manual placeholder config also exists for 'import HelloWorld from 0xHelloWorldTwo'
          const regexWithPrefix = new RegExp("(\\b" + key + "\\b)", "g")

          return cadence
            .replace(regexWithoutPrefix, value)
            .replace(regexWithPrefix, value)
        }, cadence)
      )
  }

  return ix
}