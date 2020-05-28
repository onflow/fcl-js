type Status = string
type Ix = {status?: Status}

export function isStatus(ix: Ix, status: Status): boolean {
  return ix.status === status
}
