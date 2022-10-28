import {retrieve} from "../../document/document.js"
import {normalizeInteractionTemplate} from "../../normalizers/interaction-template/interaction-template"
import {deriveCadenceByNetwork} from "../../interaction-template-utils/derive-cadence-by-network.js"
import {deriveDependencies} from "./derive-dependencies"
import {isString} from "./is"
import {getChainId} from "../../utils"

export async function prepTemplateOpts(opts) {
  if (isString(opts?.template)) {
    opts.template = await retrieve({url: opts?.template})
  }

  let dependencies = {}
  if (opts?.template) {
    opts.template = normalizeInteractionTemplate(opts?.template)
    dependencies = await deriveDependencies({template: opts.template})
  }

  const cadence =
    opts.cadence ||
    deriveCadenceByNetwork({
      template: opts.template,
      network: await getChainId(),
    })

  opts.cadence = cadence
  opts.dependencies = dependencies

  return opts
}
