const ALLOWED_META_FIELDS = new Set(["title", "description", "price", "image"])

export function meta(data = {}) {
  return ix => {
    Object.keys(data).forEach(
      key =>
        ALLOWED_META_FIELDS.has(key) ||
        (delete data[key] &&
          console.warn(`Invalid key: ${key} has been removed`))
    )

    ix.metadata = {...ix.metadata, ...data}
    return ix
  }
}
