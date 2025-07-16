import {get, pipe, Ok, Bad} from "../interaction/interaction"
import {Interaction} from "@onflow/typedefs"

/**
 * Executes validator functions that have been attached to an interaction to perform validation checks.
 *
 * @param ix The interaction object containing validators to execute
 * @returns The interaction after running all validators
 */
export async function resolveValidators(ix: Interaction): Promise<Interaction> {
  const validators = get(ix, "ix.validators", [])
  return pipe(
    ix,
    validators.map((cb: Function) => (ix: Interaction) => cb(ix, {Ok, Bad}))
  )
}
