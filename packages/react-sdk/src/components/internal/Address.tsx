import React, {useState} from "react"
import {Button} from "./Button"

export interface AddressProps {
  address: string
  label?: string
}

export const Address: React.FC<AddressProps> = ({
  address,
  label = "Address",
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        const nav = window.navigator as Navigator & {
          clipboard?: Clipboard
        }
        if (nav.clipboard) {
          await nav.clipboard.writeText(address)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      }
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  return (
    <div className="flow-flex flow-flex-col flow-items-center flow-gap-2 flow-w-full">
      <span className="flow-text-sm flow-text-slate-500 dark:flow-text-slate-400">
        {label}
      </span>
      <div
        className="flow-flex flow-items-center flow-gap-2 flow-px-4 flow-py-3 flow-bg-slate-50
          dark:flow-bg-slate-800 flow-rounded-lg flow-border flow-border-slate-200
          dark:flow-border-slate-700 flow-w-full flow-max-w-md flow-justify-between"
      >
        <span
          className="flow-flex-1 flow-font-mono flow-text-sm flow-text-slate-900
            dark:flow-text-slate-100 flow-overflow-hidden flow-text-ellipsis
            flow-whitespace-nowrap"
        >
          {address}
        </span>
        <Button
          onClick={handleCopy}
          className="flow-px-3 flow-py-1.5 flow-text-xs"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  )
}
