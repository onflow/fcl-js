import {invariant} from "@onflow/util-invariant"
import {AccessAPI, GetNodeVersionInfoRequest} from "@onflow/protobuf"
import {unary as defaultUnary} from "./unary"

const u8ToHex = (u8, context) => context.Buffer.from(u8).toString("hex")

export async function sendGetNodeVersionInfo(ix, context = {}, opts = {}) {
  invariant(
    opts.node,
    `SDK Send Get Node Version Info Error: opts.node must be defined.`
  )
  invariant(
    context.response,
    `SDK Send Get Node Version Info Error: context.response must be defined.`
  )

  const unary = opts.unary || defaultUnary

  ix = await ix

  const req = new GetNodeVersionInfoRequest()

  const res = await unary(opts.node, AccessAPI.GetNodeVersionInfo, req, context)

  let ret = context.response()
  ret.tag = ix.tag

  let nodeVersionInfo = res.getInfo()
  ret.nodeVersionInfo = {
    semver: nodeVersionInfo.getSemver(),
    commit: nodeVersionInfo.getCommit(),
    sporkId: u8ToHex(nodeVersionInfo.getSporkId_asU8(), context),
    protocolVersion: parseInt(nodeVersionInfo.getProtocolVersion()),
    sporkRootBlockHeight: parseInt(nodeVersionInfo.getSporkRootBlockHeight()),
    nodeRootBlockHeight: parseInt(nodeVersionInfo.getNodeRootBlockHeight()),
  }

  return ret
}
