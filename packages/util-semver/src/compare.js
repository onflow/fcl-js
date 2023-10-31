import {compareIdentifiers} from "./compare-identifiers"

// Official Semver Regex https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const VERSION_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

/**
 * Compares two semver versions
 * @param {string} a - The first version to compare
 * @param {string} b - The second version to compare
 * @returns {number} - Returns 1 if a is greater than b, -1 if a is less than b, and 0 if they are equal
 */
export const compare = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string")
    throw new Error("Invalid input")

  const vsnA = a.match(VERSION_REGEX)
  const vsnB = b.match(VERSION_REGEX)

  if (!vsnA || !vsnB) throw new Error("Invalid input")

  for (let i = 1; i <= 3; i++) {
    // If either is greater than the other, return
    if (parseInt(vsnA[i]) > parseInt(vsnB[i])) return 1
    if (parseInt(vsnA[i]) < parseInt(vsnB[i])) return -1
  }

  // If equal, compare prerelease
  if (vsnA[4] && vsnB[4]) {
    const prereleaseA = (vsnA[4] || "").split(".")
    const prereleaseB = (vsnB[4] || "").split(".")

    for (let i = 0; i < Math.max(prereleaseA.length, prereleaseB.length); i++) {
      // If one identifier has more fields than the other & the rest is equal, the one with more fields is greater
      if (prereleaseA[i] === undefined) return -1
      if (prereleaseB[i] === undefined) return 1

      // Compare field identifiers
      const cmp = compareIdentifiers(prereleaseA[i], prereleaseB[i])
      if (cmp !== 0) return cmp
    }
  }

  return 0
}
