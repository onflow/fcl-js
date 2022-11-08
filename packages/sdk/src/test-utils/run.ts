import {build} from "../build/build"
import {resolve} from "../resolve/resolve"
import {ref} from "../build/build-ref"

export const run = (fns = []) => build([ref("123"), ...fns]).then(resolve)
