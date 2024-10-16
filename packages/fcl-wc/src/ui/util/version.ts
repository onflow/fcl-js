declare global {
  const PACKAGE_CURRENT_VERSION: string
}

export const VERSION = PACKAGE_CURRENT_VERSION || "TESTVERSION"
