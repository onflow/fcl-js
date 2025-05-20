import {update, InteractionBuilderFn} from "../interaction/interaction"

/**
 * @description A builder function that adds a validator to a transaction
 * @param cb The validator function
 * @returns A function that processes an interaction object
 */
export function validator(cb: Function): InteractionBuilderFn {
  return update("ix.validators", validators =>
    Array.isArray(validators) ? validators.push(cb) : [cb]
  )
}
