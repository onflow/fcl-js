import {invariant} from "@onflow/util-invariant"
import * as sdk from "@onflow/sdk"
import {isRequired, isObject, isString} from "../../utils/is"

async function pre(type, opts) {
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

export async function preMutate(opts) {
  return pre("mutate", opts)
}

export async function preQuery(opts) {
  return pre("query", opts)
}
