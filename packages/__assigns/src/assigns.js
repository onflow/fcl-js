const identity = v => v

export const get = (ix, key, fallback) => {
  return ix.assigns[key] == null ? fallback : ix.assigns[key]
}

export const put = (key, value) => ix => {
  ix.assigns[key] = value
  return ix
}

export const update = (key, fn = identity) => ix => {
  ix.assigns[key] = fn(ix.assigns[key], ix)
  return ix
}

export const destroy = key => ix => {
  delete ix.assigns[key]
  return ix
}
