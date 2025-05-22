import React from "react"
import {Button, ButtonProps} from "./internal/Button"
import {FlowNetwork} from "@onflow/kit"
import {useFlowChainId} from "../hooks/useFlowChainId"

interface TransactionLinkProps {
  txId: string
  variant?: ButtonProps["variant"]
}

type ExplorerNetwork = Extract<FlowNetwork, "mainnet" | "testnet">

const BLOCK_EXPLORER_URL: Record<ExplorerNetwork, string> = {
  mainnet: "https://www.flowscan.io",
  testnet: "https://testnet.flowscan.org",
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  txId,
  variant = "primary",
}) => {
  const {data: flowNetwork} = useFlowChainId()

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
      className="no-underline"
      onClick={handleClick}
    >
      <Button
        variant={variant}
        className="mt-2 flex items-center gap-1"
        disabled={flowNetwork === "emulator"}
      >
        View on Block Explorer
        <img
          src="/assets/icons/external-link.svg"
          alt="External link"
          className="w-4 h-4"
        />
      </Button>
    </a>
  )
}
