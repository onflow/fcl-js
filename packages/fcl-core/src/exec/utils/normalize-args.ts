import {isFunc} from "../../utils/is"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import type {ArgsFn} from "../args"

/**
 * @description Normalizes function or array arguments into a standard array format for use with
 * Flow transactions and scripts. If the input is a function, it executes the function with
 * sdk.arg and types as parameters. Otherwise, returns an empty array.
 *
 * @param ax Arguments function, array, or undefined value to normalize
 * @returns Normalized array of arguments ready for use with Flow transactions/scripts
 *
 * @example
 * // Using with function-style arguments
 * const argsFn = (arg, t) => [
 *   arg("Hello", t.String),
 *   arg(42, t.Int)
 * ]
 * const normalized = normalizeArgs(argsFn)
 * // Returns: [{value: "Hello", xform: ...}, {value: 42, xform: ...}]
 */
export function normalizeArgs(ax: ArgsFn | any[] | undefined): any[] {
  if (isFunc(ax)) return (ax as ArgsFn)(sdk.arg, t)
  return []
}
