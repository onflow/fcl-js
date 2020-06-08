import { pipe, Ok, Bad } from "@onflow/interaction"

export function validator(cb) {
    return pipe([ ix => cb(ix, { Ok, Bad }) ])
}
