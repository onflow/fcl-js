import {arg} from "@onflow/sdk"
import * as t from "@onflow/types"

type ArgFn = typeof arg
type Types = typeof t
/**
 * @param arg - Argument function to define a single argument
 * @param t - Cadence Types object used to define the type
 * @returns {any[]}
 */
export type ArgsFn = (arg: ArgFn, t: Types) => any[]
