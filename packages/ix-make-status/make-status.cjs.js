exports.makeStatus = function makeStatus(ix, status, reason) {
  ix.status = status
  ix.reason = reason
  return ix
}
