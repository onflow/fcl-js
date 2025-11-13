import {isTransaction, isScript, get} from "../interaction/interaction"
import {invariant} from "@onflow/util-invariant"
import * as logger from "@onflow/util-logger"
import {withPrefix} from "@onflow/util-address"
import {Interaction} from "@onflow/typedefs"
import {SdkContext} from "../context/context"
import {withGlobalContext} from "../context/global"

const isFn = (v: any): v is Function => typeof v === "function"
const isString = (v: any): v is string => typeof v === "string"

const oldIdentifierPatternFn = (): RegExp => /\b(0x\w+)\b/g
function isOldIdentifierSyntax(
  cadence: string,
  legacyContractIdentifiers: Record<string, string> = {}
): boolean {
  const matches = cadence.matchAll(oldIdentifierPatternFn())
  for (const match of matches) {
    const identifier = match[0]
    // Only return true if we have a legacy identifier that needs replacement
    if (legacyContractIdentifiers[identifier]) {
      return true
    }
  }
  return false
}

const newIdentifierPatternFn = (): RegExp => /import\s+"(\w+)"/g
function isNewIdentifierSyntax(cadence: string): boolean {
  return newIdentifierPatternFn().test(cadence)
}

function getContractIdentifierSyntaxMatches(
  cadence: string
): IterableIterator<RegExpMatchArray> {
  return cadence.matchAll(newIdentifierPatternFn())
}

export function createResolveCadence(context: SdkContext) {
  return async function resolveCadence(ix: Interaction): Promise<Interaction> {
    if (!isTransaction(ix) && !isScript(ix)) return ix

    var cadence = get(ix, "ix.cadence")

    invariant(
      isFn(cadence) || isString(cadence),
      "Cadence needs to be a function or a string."
    )
    if (isFn(cadence)) cadence = await cadence({} as Record<string, never>)
    invariant(isString(cadence), "Cadence needs to be a string at this point.")
    invariant(
      !isOldIdentifierSyntax(cadence, context.legacyContractIdentifiers) ||
        !isNewIdentifierSyntax(cadence),
      "Both account identifier and contract identifier syntax not simultaneously supported."
    )

    if (isOldIdentifierSyntax(cadence, context.legacyContractIdentifiers)) {
      cadence = Object.entries(context.legacyContractIdentifiers || {}).reduce(
        (cadence, [key, value]) => {
          const regex = new RegExp("(\\b" + key + "\\b)", "g")
          return cadence.replace(regex, value)
        },
        cadence
      )
    }

    if (isNewIdentifierSyntax(cadence)) {
      for (const [
        fullMatch,
        contractName,
      ] of getContractIdentifierSyntaxMatches(cadence)) {
        const address: string | null = context.contracts[contractName] || null
        if (address) {
          const canonical: string | null = context.contracts[contractName + ".canonical"] || null
          const importStatement = canonical
            ? `import ${canonical} as ${contractName} from ${withPrefix(address)}`
            : `import ${contractName} from ${withPrefix(address)}`
          cadence = cadence.replace(fullMatch, importStatement)
        } else {
          logger.log({
            title: "Contract Placeholder not found",
            message: `Cannot find a value for contract placeholder ${contractName}. Please add to your flow.json or explicitly add it to the config 'contracts.*' namespace.`,
            level: logger.LEVELS.warn,
          })
        }
      }
    }

    // We need to move this over in any case.
    ix.message.cadence = cadence

    return ix
  }
}

export const resolveCadence =
  /* @__PURE__ */ withGlobalContext(createResolveCadence)
