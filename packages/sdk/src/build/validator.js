import { update } from "@onflow/interaction"

export function validator(cb) {
    return update('ix.validators', validators => 
        validators ? validators.push(cb) : [cb]
    )
}
