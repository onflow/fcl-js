import {build} from "../build/build"
import {resolve} from "../resolve/resolve"
import {ref} from "../build/build-ref"
import {Interaction} from "@onflow/typedefs"

/**
 * Runs a set of functions on an interaction
 *
 * @param fns An array of functions to run on the interaction
 * @returns A promise that resolves to the resolved interaction
 */
export const run = (
  fns: Array<(ix: Interaction) => Interaction | Promise<Interaction>> = []
) => build([ref("123"), ...fns]).then(resolve)
