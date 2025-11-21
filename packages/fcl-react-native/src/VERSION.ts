declare const PACKAGE_CURRENT_VERSION: string | undefined

// Use PACKAGE_CURRENT_VERSION if available (from build), otherwise use a default for development
// NOTE: Discovery API requires a valid semver version for local testing
export const VERSION: string =
  typeof PACKAGE_CURRENT_VERSION !== "undefined"
    ? PACKAGE_CURRENT_VERSION
    : "1.13.5-TESTVERSION"
