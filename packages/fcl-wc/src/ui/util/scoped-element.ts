import {customElement, CustomElementDecorator} from "lit/decorators.js"
import {VERSION} from "./version"
import {LitElement} from "lit"

const SCOPE_PREFIX = "fcl-wc"

export const getScopedTagName = (cls: new () => LitElement) => {
  const className = cls.constructor.name.toLocaleLowerCase()
  const tag = `${SCOPE_PREFIX}-${className}-${VERSION}`
  return tag
}

// This is important for the versioning and scoping of the custom elements
// This will ensure that the custom elements are unique to the package
// and that they are versioned
//
// In Node, there is the potential for multiple versions of the same package
// to be installed in the same project.  And because custom elements are global
// they may conflict with each other.
export const scopedElement = (cls: new () => LitElement) => {
  customElement(getScopedTagName(cls))(cls)
}
