import {invariant} from "@onflow/util-invariant"
import {httpRequest as defaultHttpRequest} from "./http-request.js"
import {Interaction} from "@onflow/typedefs"

export async function sendGetNodeVersionInfo(
  ix: Interaction | Promise<Interaction>,
  context: any = {},
  opts: any = {}
) {
  invariant(
    opts.node,
    `SDK Send Get Node Version Info Error: opts.node must be defined.`
  )
  invariant(
    context.response,
    `SDK Send Get Node Verison Info Error: context.response must be defined.`
  )

  const httpRequest = opts.httpRequest || defaultHttpRequest

  ix = await ix

  const res = await httpRequest({
    hostname: opts.node,
    path: `/v1/node_version_info`,
    method: "GET",
  })

  let ret = context.response()
  ret.tag = ix.tag

  ret.nodeVersionInfo = {
    semver: res.semver,
    commit: res.commit,
    sporkId: res.spork_id,
    protocolVersion: parseInt(res.protocol_version),
    sporkRootBlockHeight: parseInt(res.spork_root_block_height),
    nodeRootBlockHeight: parseInt(res.node_root_block_height),
  }
  return ret
}
