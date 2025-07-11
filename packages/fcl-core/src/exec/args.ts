import {arg} from "@onflow/sdk"
import * as t from "@onflow/types"

type ArgFn = typeof arg
type Types = typeof t

/**
 * @description Type definition for argument functions used to define transaction and script arguments
 *
 * @param arg Argument function to define a single argument
 * @param t Cadence Types object used to define the type
 * @returns Array of arguments
 */
export type ArgsFn = (arg: ArgFn, t: Types) => any[]
