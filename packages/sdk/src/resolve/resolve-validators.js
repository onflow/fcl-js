import { get, pipe, Ok, Bad } from "@onflow/interaction"

export async function resolveValidators(ix) {
    const validators = get(ix, 'ix.validators', [])

    return pipe(ix, validators.map(cb => ix => cb(ix, { Ok, Bad })))
}   
