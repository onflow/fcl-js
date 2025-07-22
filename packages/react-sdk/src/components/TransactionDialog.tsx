import React, {useEffect} from "react"
import {Dialog} from "./internal/Dialog"
import {Button} from "./internal/Button"
import {TransactionLink} from "./TransactionLink"
import {LoaderCircleIcon} from "../icons/LoaderCircleIcon"
import {CircleCheckIcon} from "../icons/CircleCheckIcon"
import {useFlowTransactionStatus} from "../hooks/useFlowTransactionStatus"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  txId?: string
  onSuccess?: () => void
  pendingTitle?: string
  pendingDescription?: string
  successTitle?: string
  successDescription?: string
  closeOnSuccess?: boolean
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onOpenChange,
  txId,
  onSuccess,
  pendingTitle,
  pendingDescription,
  successTitle,
  successDescription,
  closeOnSuccess,
}) => {
  const {transactionStatus} = useFlowTransactionStatus({id: txId})
  const isSuccess =
    typeof transactionStatus?.status === "number" &&
    transactionStatus.status >= 3

  useEffect(() => {
    if (isSuccess) {
      if (onSuccess) onSuccess()
      if (closeOnSuccess) onOpenChange(false)
    }
  }, [isSuccess, onSuccess, closeOnSuccess, onOpenChange])

  return (
    <Dialog isOpen={open} onClose={() => onOpenChange(false)}>
      <div
        className="flow-flex flow-flex-col flow-items-center flow-gap-4 flow-py-8
          flow-min-w-[320px] flow-animate-fade-in"
      >
        <div className="flow-flex flow-flex-col flow-items-center flow-gap-2">
          {!isSuccess ? (
            <LoaderCircleIcon className="flow-animate-spin flow-text-blue-500 flow-w-12 flow-h-12" />
          ) : (
            <CircleCheckIcon className="flow-text-green-500 flow-animate-pop flow-w-12 flow-h-12" />
          )}
          <div className="flow-text-lg flow-font-semibold flow-text-center">
            {!isSuccess
              ? pendingTitle || "Transaction Pending"
              : successTitle || "Transaction Successful"}
          </div>
        </div>
        <div className="flow-text-center flow-text-gray-500 flow-text-sm">
          {!isSuccess
            ? pendingDescription ||
              "Your transaction is being processed. Please wait..."
            : successDescription || "Your transaction was successful!"}
        </div>
        {isSuccess && txId && <TransactionLink txId={txId} variant="link" />}
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flow-mt-4"
        >
          Close
        </Button>
      </div>
    </Dialog>
  )
}
