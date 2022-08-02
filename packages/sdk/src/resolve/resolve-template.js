import {isTransaction, isScript, get, put, pipe} from "../interaction/interaction.js"
import {invariant} from "@onflow/util-invariant"
import {config} from "@onflow/config"
import {retrieve} from "../document/document.js"

export async function resolveTemplate(ix) {
  if (isTransaction(ix) || isScript(ix)) {
    let template = ix.template
    if (!template) return ix

    if (typeof template === "string") {
        template = await retrieve({ url: template })
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
