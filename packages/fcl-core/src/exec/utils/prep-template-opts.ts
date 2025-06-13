import {retrieve} from "../../document/document"
import {deriveCadenceByNetwork} from "../../interaction-template-utils/derive-cadence-by-network/derive-cadence-by-network"
import {isString} from "../../utils/is"
import {getChainId} from "../../utils"

export interface TemplateOptions {
  cadence?: string
  template?: any
}

export async function prepTemplateOpts(
  opts: TemplateOptions
): Promise<TemplateOptions> {
  if (isString(opts?.template)) {
    opts.template = await retrieve({url: opts?.template})
  }

  const cadence =
    opts.cadence ||
    (await deriveCadenceByNetwork({
      template: opts.template,
      network: await getChainId(opts),
    }))

  opts.cadence = cadence

  return opts
}
