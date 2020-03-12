import {pipe} from "@qvvg/mario"
import {put} from "@onflow/assigns"

export const referenceBlockHash = referenceBlockHash =>
  pipe([put("referenceBlockHash", referenceBlockHash)])
