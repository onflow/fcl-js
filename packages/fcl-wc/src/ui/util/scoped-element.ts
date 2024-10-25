import {VERSION} from "./version"

const SCOPE_PREFIX = "fcl-wc"

// Get a scoped tag name for a custom element
// This prevents naming conflicts with other custom elements
// The most likely conflict would be with the same element in a different version of the library
export const getScopedTagName = (baseName: string) => {
  const className = baseName.toLocaleLowerCase()
  const tag = `${SCOPE_PREFIX}-${className}-${VERSION}`
  return tag
}
