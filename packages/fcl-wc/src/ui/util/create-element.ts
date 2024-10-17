import type {LitElement, PropertyValues} from "lit"
import {getScopedTagName} from "./scoped-element"

export const createElement = <T extends LitElement>(
  element: new () => T,
  props: PropertyValues<T>
) => {
  const el = document.createElement(getScopedTagName(element)) as T
  for (const [key, value] of Object.entries(props)) {
    el[key as keyof T] = value
  }
  return el
}
