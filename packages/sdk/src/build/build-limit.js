export function limit(computeLimit) {
  return ix => {
    ix.message.computeLimit = computeLimit
    return ix
  }
}
