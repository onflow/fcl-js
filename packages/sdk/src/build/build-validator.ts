import {update} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

export function validator(cb: Function): (ix: Interaction) => Interaction {
  return update("ix.validators", (validators: Function | Function[]) =>
    Array.isArray(validators) ? [...validators, cb] : [cb]
  )
}
