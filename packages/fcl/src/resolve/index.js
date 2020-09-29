import { resolveRefBlockId } from "@onflow/sdk"
import {pipe} from "@onflow/interaction"
import {resolveCadence} from "@onflow/sdk-resolve-cadence"
import {resolveArguments} from "@onflow/sdk-resolve-arguments"
import {resolveAccounts} from "@onflow/sdk-resolve-accounts"
import {resolveSignatures} from "@onflow/sdk-resolve-signatures"
import {resolveValidators} from "@onflow/sdk-resolve-validators"
import {config} from "@onflow/config"

export const resolve = async ix => pipe(ix, [
  resolveCadence,
  resolveArguments,
  resolveAccounts,
  resolveRefBlockId({node: await config().get("accessNode.api")}),
  resolveValidators,
  resolveSignatures,
])
