import {build, resolve, ref} from "../sdk"

export const run = (fns = []) => build([ref("123"), ...fns]).then(resolve)
