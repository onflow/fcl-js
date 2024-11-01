import {invariant} from "@onflow/util-invariant"
import {sendTransaction} from "./send-transaction.js"
import {sendGetTransactionStatus} from "./send-get-transaction-status.js"
import {sendGetTransaction} from "./send-get-transaction.js"
import {sendExecuteScript} from "./send-execute-script.js"
import {sendGetAccount} from "./send-get-account.js"
import {sendGetEvents} from "./send-get-events.js"
import {connectSubscribeEvents} from "./connect-subscribe-events.js"
import {sendGetBlock} from "./send-get-block.js"
import {sendGetBlockHeader} from "./send-get-block-header.js"
import {sendGetCollection} from "./send-get-collection.js"
import {sendPing, ISendPingContext} from "./send-ping"
import {sendGetNetworkParameters} from "./send-get-network-parameters.js"
import {Interaction} from "@onflow/typedefs"
import {sendGetNodeVersionInfo} from "./send-get-node-version-info.js"

interface InteractionModule {
  isTransaction: (ix: Interaction) => boolean
  isGetTransactionStatus: (ix: Interaction) => boolean
  isGetTransaction: (ix: Interaction) => boolean
  isScript: (ix: Interaction) => boolean
  isGetAccount: (ix: Interaction) => boolean
  isGetEvents: (ix: Interaction) => boolean
  isGetBlock: (ix: Interaction) => boolean
  isGetBlockHeader: (ix: Interaction) => boolean
  isGetCollection: (ix: Interaction) => boolean
  isPing: (ix: Interaction) => boolean
  isGetNetworkParameters: (ix: Interaction) => boolean
  isSubscribeEvents?: (ix: Interaction) => boolean
  isGetNodeVersionInfo?: (ix: Interaction) => boolean
}
interface IContext extends ISendPingContext {
  ix: InteractionModule
}

interface IOptsCommon {
  node?: string
}

interface IOpts extends IOptsCommon {
  sendTransaction?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetTransactionStatus?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetTransaction?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendExecuteScript?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetAccount?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetEvents?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetBlockHeader?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetCollection?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendPing?: (ix: Interaction, context: IContext, opts: IOptsCommon) => void
  sendGetBlock?: (ix: Interaction, context: IContext, opts: IOptsCommon) => void
  sendGetNetworkParameters?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  connectSubscribeEvents?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
  sendGetNodeVersionInfo?: (
    ix: Interaction,
    context: IContext,
    opts: IOptsCommon
  ) => void
}

export const send = async (
  ix: Interaction,
  context: IContext,
  opts: IOpts = {}
) => {
  invariant(
    Boolean(opts?.node),
    `SDK Send Error: Either opts.node or "accessNode.api" in config must be defined.`
  )
  invariant(Boolean(context.ix), `SDK Send Error: context.ix must be defined.`)

  ix = await ix

  // prettier-ignore
  switch (true) {
    case context.ix.isTransaction(ix):
      return opts.sendTransaction ? opts.sendTransaction(ix, context, opts) : sendTransaction(ix, context, opts)
    case context.ix.isGetTransactionStatus(ix):
      return opts.sendGetTransactionStatus ? opts.sendGetTransactionStatus(ix, context, opts) : sendGetTransactionStatus(ix, context, opts)
    case context.ix.isGetTransaction(ix):
      return opts.sendGetTransaction ? opts.sendGetTransaction(ix, context, opts) : sendGetTransaction(ix, context, opts)
    case context.ix.isScript(ix):
      return opts.sendExecuteScript ? opts.sendExecuteScript(ix, context, opts) : sendExecuteScript(ix, context, opts)
    case context.ix.isGetAccount(ix):
      return opts.sendGetAccount ? opts.sendGetAccount(ix, context, opts) : sendGetAccount(ix, context, opts)
    case context.ix.isGetEvents(ix):
      return opts.sendGetEvents ? opts.sendGetEvents(ix, context, opts) : sendGetEvents(ix, context, opts)
    case context.ix.isSubscribeEvents?.(ix):
      return opts.connectSubscribeEvents ? opts.connectSubscribeEvents(ix, context, opts) : connectSubscribeEvents(ix, context, opts)
    case context.ix.isGetBlock(ix):
      return opts.sendGetBlock ? opts.sendGetBlock(ix, context, opts) : sendGetBlock(ix, context, opts)
    case context.ix.isGetBlockHeader(ix):
      return opts.sendGetBlockHeader ? opts.sendGetBlockHeader(ix, context, opts) : sendGetBlockHeader(ix, context, opts)
    case context.ix.isGetCollection(ix):
      return opts.sendGetCollection ? opts.sendGetCollection(ix, context, opts) : sendGetCollection(ix, context, opts)
    case context.ix.isPing(ix):
      return opts.sendPing ? opts.sendPing(ix, context, opts) : sendPing(ix, context, opts)
    case context.ix.isGetNetworkParameters(ix):
      return opts.sendGetNetworkParameters ? opts.sendGetNetworkParameters(ix, context, opts) : sendGetNetworkParameters(ix, context, opts)
    case context.ix.isGetNodeVersionInfo?.(ix):
      return opts.sendGetNodeVersionInfo ? opts.sendGetNodeVersionInfo(ix, context, opts) : sendGetNodeVersionInfo(ix, context, opts)
    default:
      return ix
  }
}
