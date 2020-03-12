import {pipe} from "@qvvg/mario"
import {makeGetLatestBlock} from "@onflow/interaction"
import {put} from "@onflow/assigns"

export const getLatestBlock = (isSealed = false) =>
  pipe([makeGetLatestBlock, put("isSealed", isSealed)])
