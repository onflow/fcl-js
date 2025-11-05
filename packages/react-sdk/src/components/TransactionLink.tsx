import React from "react"
import {Button, ButtonProps} from "./internal/Button"
import {StyleWrapper} from "./internal/StyleWrapper"
import {useFlowChainId} from "../hooks/useFlowChainId"
import {ExternalLinkIcon} from "../icons/ExternalLink"
import {getFlowscanTxUrl} from "../utils/flowscan"

interface TransactionLinkProps {
  /** The transaction ID (256-bit hash as hex string) or scheduled transaction ID (UInt64 as decimal string) */
  txId: string
  variant?: ButtonProps["variant"]
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  txId,
  variant = "link",
}) => {
  const {data: chainId} = useFlowChainId()

  const handleClick = (e: React.MouseEvent) => {
    if (chainId === "emulator" || chainId === "local") {
      e.preventDefault()
      console.warn("Block explorer links are not available in emulator mode")
    }
  }

  const explorerUrl = getFlowscanTxUrl(txId, chainId) || "#"

  return (
    <StyleWrapper>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flow-no-underline"
        onClick={handleClick}
      >
        <Button
          variant={variant}
          className="flow-mt-2 flow-flex flow-items-center flow-gap-1"
          disabled={chainId === "emulator" || chainId === "local"}
        >
          View on Block Explorer
          <ExternalLinkIcon className="flow-w-4 flow-h-4" />
        </Button>
      </a>
    </StyleWrapper>
  )
}
