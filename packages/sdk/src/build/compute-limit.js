import {pipe} from "@qvvg/mario"
import {put} from "@onflow/assigns"

export const computeLimit = computeLimit =>
  pipe([put("computeLimit", computeLimit)])
