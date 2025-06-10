import {get, pipe, Ok, Bad} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

export async function resolveValidators(ix: Interaction): Promise<Interaction> {
  const validators = get(ix, "ix.validators", [])
  return pipe(
    ix,
    validators.map((cb: Function) => (ix: Interaction) => cb(ix, {Ok, Bad}))
  )
}
