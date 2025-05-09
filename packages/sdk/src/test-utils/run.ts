import {build} from "../build/build"
import {resolve} from "../resolve/resolve"
import {ref} from "../build/build-ref"
import {Interaction} from "@onflow/typedefs"

export const run = (
  fns: Array<(ix: Interaction) => Interaction | Promise<Interaction>> = []
) => build([ref("123"), ...fns]).then(resolve)
