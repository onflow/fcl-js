import {get, pipe, Ok, Bad} from "../interaction/interaction"

export async function resolveValidators(ix) {
  const validators = get(ix, "ix.validators", [])
  return pipe(
    ix,
    validators.map(cb => ix => cb(ix, {Ok, Bad}))
  )
}
