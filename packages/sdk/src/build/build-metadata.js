import {pipe} from "../interaction/interaction.js"

const ALLOWED_META_FIELDS = new Set(["title", "description", "price", "image"])

export function meta(data = {}) {
  return ix => {
    Object.keys(data).forEach(
      key => ALLOWED_META_FIELDS.has(key) || delete data[key]
    )

    ix.metadata = {...ix.metadata, ...data}
    return ix
  }
}
