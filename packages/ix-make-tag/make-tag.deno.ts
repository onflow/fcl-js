type Tag = string
type Ix = {tag?: Tag}

export function makeTag(ix: Ix, tag: Tag): Ix {
  ix.tag = tag
  return ix
}
