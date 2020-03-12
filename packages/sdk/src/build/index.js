import {pipe} from "@qvvg/mario"
import {interaction} from "@onflow/interaction"

export const build = fns => pipe(interaction(), fns)
