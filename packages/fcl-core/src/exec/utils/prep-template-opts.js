import {retrieve} from "../../document/document.js"
import {deriveCadenceByNetwork} from "../../interaction-template-utils/derive-cadence-by-network/derive-cadence-by-network.js"
import {deriveDependencies} from "./derive-dependencies"
import {isString} from "../../utils/is"
import {getChainId} from "../../utils"

export async function prepTemplateOpts(opts) {
  if (isString(opts?.template)) {
    opts.template = await retrieve({url: opts?.template})
  }

  let dependencies = {}
  if (opts?.template) {
    dependencies = await deriveDependencies({template: opts.template})
  }

  const cadence =
    opts.cadence ||
    (await deriveCadenceByNetwork({
      template: opts.template,
      network: await getChainId(opts),
    }))

  opts.cadence = cadence
  opts.dependencies = dependencies

  return opts
}
