type Status = string
type Reason = string
type Ix = {status?: Status; reason?: Reason}

export function makeStatus(ix: Ix, status?: Status, reason?: Reason): Ix {
  ix.status = status
  ix.reason = reason
  return ix
}
