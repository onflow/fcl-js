import {invariant} from "@onflow/util-invariant"
import * as sdk from "@onflow/sdk"
import {isRequired, isObject, isString} from "../../utils/is"

export interface PreOptions {
  cadence?: string
  template?: any
}

async function pre(type: string, opts: PreOptions): Promise<void> {
  // prettier-ignore
  invariant(isRequired(opts), `${type}(opts) -- opts is required`)
  // prettier-ignore
  invariant(isObject(opts), `${type}(opts) -- opts must be an object`)
  // prettier-ignore
  invariant(!(opts.cadence && opts.template), `${type}({ template, cadence }) -- cannot pass both cadence and template`)
  // prettier-ignore
  invariant(isRequired(opts.cadence || opts?.template), `${type}({ cadence }) -- cadence is required`)
  // // prettier-ignore
  invariant(
    isString(opts.cadence) || opts?.template,
    `${type}({ cadence }) -- cadence must be a string`
  )
  // prettier-ignore
  invariant(
    await sdk.config().get("accessNode.api"),
    `${type}(opts) -- Required value for "accessNode.api" not defined in config. See: ${"https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/exec/query.md#configuration"}`
  )
}

/**
 * @description Validates and prepares options for Flow transaction execution (mutations). This function
 * performs comprehensive validation of the provided options to ensure they meet the requirements for
 * executing transactions on the Flow blockchain, including checking for required configuration values.
 *
 * @param opts Options object containing either Cadence code or template references for the transaction
 * @param opts.cadence Optional Cadence transaction code string
 * @param opts.template Optional interaction template object or reference
 * @returns Promise that resolves when validation passes
 * @throws Error if validation fails or required configuration is missing
 *
 * @example
 * // Validate transaction options with Cadence code
 * await preMutate({
 *   cadence: "transaction { execute { log(\"Hello Flow!\") } }"
 * })
 *
 * // Validate transaction options with template
 * await preMutate({
 *   template: transferFlowTemplate
 * })
 */
export async function preMutate(opts: PreOptions): Promise<void> {
  return pre("mutate", opts)
}

/**
 * @description Validates and prepares options for Flow script execution (queries). This function
 * performs comprehensive validation of the provided options to ensure they meet the requirements for
 * executing scripts on the Flow blockchain, including checking for required configuration values.
 *
 * @param opts Options object containing either Cadence code or template references for the script
 * @param opts.cadence Optional Cadence script code string
 * @param opts.template Optional interaction template object or reference
 * @returns Promise that resolves when validation passes
 * @throws Error if validation fails or required configuration is missing
 *
 * @example
 * // Validate script options with Cadence code
 * await preQuery({
 *   cadence: "access(all) fun main(): String { return \"Hello Flow!\" }"
 * })
 *
 * // Validate script options with template
 * await preQuery({
 *   template: getAccountTemplate
 * })
 */
export async function preQuery(opts: PreOptions): Promise<void> {
  return pre("query", opts)
}
