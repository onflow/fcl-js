import {customElement, CustomElementDecorator} from "lit/decorators.js"
import {VERSION} from "./version"

const SCOPE_PREFIX = "fcl-wc"

// This is important for the versioning and scoping of the custom elements
// This will ensure that the custom elements are unique to the package
// and that they are versioned
//
// In Node, there is the potential for multiple versions of the same package
// to be installed in the same project.  And because custom elements are global
// they may conflict with each other.
export const scopedElement = (tagName: string): CustomElementDecorator => {
  return cls => {
    customElement(`${SCOPE_PREFIX}-${tagName}-${VERSION}`)(cls)
  }
}
