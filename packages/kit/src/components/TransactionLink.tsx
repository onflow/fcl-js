import React from "react"
import {Button, ButtonProps} from "./internal/Button"
import {useFlowChainId} from "../hooks/useFlowChainId"
import {FlowNetwork} from "../core/types"

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
      className="no-underline"
      onClick={handleClick}
    >
      <Button
        variant={variant}
        className="mt-2 flex items-center gap-1"
        disabled={flowNetwork === "emulator"}
      >
        View on Block Explorer
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          <path
            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 3h6v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 14L21 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </a>
  )
}
