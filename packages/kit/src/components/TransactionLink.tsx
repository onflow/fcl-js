import React from "react"
import {Button, ButtonProps} from "./internal/Button"
import {useFlowChainId} from "../hooks/useFlowChainId"
import {FlowNetwork} from "../core/types"
import {ExternalLinkIcon} from "../icons/ExternalLink"

interface TransactionLinkProps {
  txId: string
  variant?: ButtonProps["variant"]
}

type ExplorerNetwork = Extract<FlowNetwork, "mainnet" | "testnet">

const BLOCK_EXPLORER_URL: Record<ExplorerNetwork, string> = {
  mainnet: "https://www.flowscan.io",
  testnet: "https://testnet.flowscan.io",
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  txId,
  variant = "link",
}) => {
  const {data: chainId} = useFlowChainId()
  const flowNetwork = chainId as FlowNetwork | undefined

  const handleClick = (e: React.MouseEvent) => {
    if (flowNetwork === "emulator") {
      e.preventDefault()
      console.warn("Block explorer links are not available in emulator mode")
    }
  }

  const explorerUrl =
    flowNetwork === "mainnet" || flowNetwork === "testnet"
      ? `${BLOCK_EXPLORER_URL[flowNetwork]}/tx/${txId}`
      : "#"

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flow-no-underline"
      onClick={handleClick}
      style={{ all: "unset" }}
    >
      <Button
        variant={variant}
        className="flow-mt-2 flow-flex flow-items-center flow-gap-1"
        disabled={flowNetwork === "emulator"}
        style={{ all: "unset" }}
      >
        View on Block Explorer
        <ExternalLinkIcon className="flow-w-4 flow-h-4" />
      </Button>
    </a>
  )
}
