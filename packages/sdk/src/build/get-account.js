import {pipe} from "@qvvg/mario"
import {makeGetAccount} from "@onflow/interaction"
import {put} from "@onflow/assigns"

export const getAccount = address =>
  pipe([makeGetAccount, put("address", address)])
