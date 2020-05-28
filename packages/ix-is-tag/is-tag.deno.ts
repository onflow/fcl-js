type Tag = string
type Ix = {tag?: Tag}

export function makeTag(ix: Ix, tag: Tag): boolean {
  return ix.tag === tag
}
