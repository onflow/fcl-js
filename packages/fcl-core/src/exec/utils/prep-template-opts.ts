import {retrieve} from "../../document/document"
import {deriveCadenceByNetwork} from "../../interaction-template-utils/derive-cadence-by-network/derive-cadence-by-network"
import {isString} from "../../utils/is"
import {FCLContext} from "../../context"
import {createGetChainId} from "../../utils"

export interface TemplateOptions {
  cadence?: string
  template?: any
}

/**
 * @description Prepares and processes template options for Flow transactions and scripts. This function handles
 * the resolution of interaction templates by either fetching them from a URL or using provided template data,
 * and derives the appropriate Cadence code based on the current network configuration.
 *
 * @param opts Template options object that can contain either direct Cadence code or template references
 * @param opts.cadence Optional Cadence code string to use directly
 * @param opts.template Optional template object or URL string. If a URL string is provided, the template will be fetched
 * @returns Promise that resolves to the processed template options with resolved Cadence code
 *
 * @example
 * // Prepare template with direct Cadence code
 * const opts = await prepTemplateOpts({
 *   cadence: "transaction { execute { log(\"Hello Flow!\") } }"
 * })
 *
 * // Prepare template from URL
 * const opts = await prepTemplateOpts({
 *   template: "https://flix.flow.com/v1/templates/transfer-flow"
 * })
 *
 * // Prepare template with template object
 * const opts = await prepTemplateOpts({
 *   template: {
 *     f_type: "InteractionTemplate",
 *     f_version: "1.1.0",
 *     id: "transfer-flow",
 *     data: { cadence: { "flow-mainnet": "transaction { ... }" } }
 *   }
 * })
 */
export async function prepTemplateOpts(
  context: FCLContext,
  opts: TemplateOptions
): Promise<TemplateOptions> {
  if (isString(opts?.template)) {
    opts.template = await retrieve(context, {url: opts?.template})
  }

  const cadence =
    opts.cadence ||
    (await deriveCadenceByNetwork({
      template: opts.template,
      network: await createGetChainId(context)(opts),
    }))

  opts.cadence = cadence

  return opts
}
