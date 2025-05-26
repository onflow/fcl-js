import {invariant} from "@onflow/util-invariant"
import * as sdk from "@onflow/sdk"
import {isRequired, isObject, isString} from "../../utils/is"

export interface PreOptions {
  cadence?: string
  template?: any
  [key: string]: any
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

export async function preMutate(opts: PreOptions): Promise<void> {
  return pre("mutate", opts)
}

export async function preQuery(opts: PreOptions): Promise<void> {
  return pre("query", opts)
}
