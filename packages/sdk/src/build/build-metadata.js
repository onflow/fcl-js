import {pipe} from "../interaction/interaction.js"
const ALLOWED_META_FIELDS = new Set(["title", "description", "price", "image"])

const applyMeta = (data = {}) => ix => {
  ix.metadata = data
  return ix
}

const validateMetaAsStrings = ix => {
  for (let key of Array.from(ALLOWED_META_FIELDS)) {
    if (typeof ix.metadata[key] !== "string")
      throw new Error(
        `Invalid type for meta field, expected string, got ${typeof ix.metadata[
          key
        ]}`
      )
  }
  return ix
}

const scrubInvalidMetaFields = ix => {
  for (let key of Object.keys(ix.metadata)) {
    if (!ALLOWED_META_FIELDS.has(key)) {
      delete ix.metadata[key]
      console.warn(`Invalid metadata field: ${key} has been removed`)
    }
  }
  return ix
}
export function meta(data = {}) {
  return pipe([applyMeta(data), validateMetaAsStrings, scrubInvalidMetaFields])
}
