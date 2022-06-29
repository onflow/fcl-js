import {isTransaction, isScript, get, put, pipe} from "../interaction/interaction.js"
import {invariant} from "@onflow/util-invariant"
import {config} from "@onflow/config"

const isFn = v => typeof v === "function"
const isString = v => typeof v === "string"

export async function resolveTemplate(ix) {
  if (isTransaction(ix) || isScript(ix)) {
    let template = ix.template
    if (!template) return ix

    // TODO: Support proper template resolvers
    if (typeof template === "string") {
        template = await fetch(template)
            .then(res => res.json())
            .catch(e => null)
    }

    invariant(template !== null, "Failed to resolve template")

    ix.template = template

    if (template?.data?.cadence) {
        return pipe(ix, [
            put("ix.cadence", template?.data?.cadence)
        ])
    }
  }

  return ix
}
