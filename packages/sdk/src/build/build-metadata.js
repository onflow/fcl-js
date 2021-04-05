import {pipe, Ok} from "../interaction/interaction.js"

const ALLOWED_META_FIELDS = new Set(["title", "description", "price", "image"])

export function meta(data = {}) {
  return pipe([
    ix => {
      if (Object.keys(data).length > ALLOWED_META_FIELDS.length) {
        throw new Error("Wrong number of metadata keys")
      }
      Object.keys(data).forEach(
        key => ALLOWED_META_FIELDS.has(key) || delete data[key]
      )

      ix.metadata = {...ix.metadata, ...data}
      return Ok(ix)
    },
  ])
}
