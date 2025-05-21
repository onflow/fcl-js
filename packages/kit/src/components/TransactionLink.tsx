import React from "react"
import {Button, ButtonProps} from "./internal/Button"
import {FlowNetwork} from "@onflow/kit"

interface TransactionLinkProps {
  txId: string
  variant?: ButtonProps["variant"]
}

const BLOCK_EXPLORER_URL = {
  mainnet: "https://www.flowscan.io",
  testnet: "https://testnet.flowscan.org",
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  txId,
  variant = "primary",
}) => {
  const flowNetwork = process.env.NEXT_PUBLIC_FLOW_NETWORK as FlowNetwork
  
  const handleClick = (e: React.MouseEvent) => {
    if (flowNetwork === "emulator") {
      e.preventDefault()
      console.warn("Block explorer links are not available in emulator mode")
    }
  }

  const explorerUrl = flowNetwork === "emulator" 
    ? "#" 
    : `${BLOCK_EXPLORER_URL[flowNetwork]}/tx/${txId}`

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
