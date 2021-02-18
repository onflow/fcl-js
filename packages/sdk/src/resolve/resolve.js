import {pipe} from "../interaction/interaction.js"
import {resolveRefBlockId} from "./resolve-ref-block-id.js"
import {resolveCadence} from "./resolve-cadence.js"
import {resolveArguments} from "./resolve-arguments.js"
import {resolveAccounts} from "./resolve-accounts.js"
import {resolveSignatures} from "./resolve-signatures.js"
import {resolveValidators} from "./resolve-validators.js"

export const resolve = opts => pipe([
  resolveCadence,
  resolveArguments,
  resolveAccounts,
  resolveRefBlockId(opts),
  resolveSignatures,
  resolveValidators,
])