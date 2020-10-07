import {pipe} from "@onflow/interaction"
import {resolveRefBlockId} from "@onflow/sdk-resolve-ref-block-id"
import {resolveCadence} from "@onflow/sdk-resolve-cadence"
import {resolveArguments} from "@onflow/sdk-resolve-arguments"
import {resolveAccounts} from "@onflow/sdk-resolve-accounts"
import {resolveSignatures} from "@onflow/sdk-resolve-signatures"
import {resolveValidators} from "@onflow/sdk-resolve-validators"

export const resolve = opts => pipe([
  resolveCadence,
  resolveArguments,
  resolveAccounts,
  resolveRefBlockId(opts),
  resolveSignatures,
  resolveValidators,
])
