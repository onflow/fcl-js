/// <reference types="./types.d.ts" />
export function makeStatus(ix, tag, reason) {
  ix.tag = tag
  return ix
}
