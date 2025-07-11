import React, {useEffect} from "react"
import {Dialog} from "./internal/Dialog"
import {Button} from "./internal/Button"
import {TransactionLink} from "./TransactionLink"
import {LoaderCircleIcon} from "../icons/LoaderCircleIcon"
import {CircleCheckIcon} from "../icons/CircleCheckIcon"
import {useFlowTransactionStatus} from "../hooks/useFlowTransactionStatus"
import {ShadowRoot} from "./internal/ShadowRoot"

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
    <ShadowRoot>
      <Dialog isOpen={open} onClose={() => onOpenChange(false)}>
        <div
          className="flex flex-col items-center gap-4 py-8
            min-w-[320px] animate-fade-in"
        >
          <div className="flex flex-col items-center gap-2">
            {!isSuccess ? (
              <LoaderCircleIcon className="animate-spin text-blue-500 w-12 h-12" />
            ) : (
              <CircleCheckIcon className="text-green-500 animate-pop w-12 h-12" />
            )}
            <div className="text-lg font-semibold text-center">
              {!isSuccess
                ? pendingTitle || "Transaction Pending"
                : successTitle || "Transaction Successful"}
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            {!isSuccess
              ? pendingDescription ||
                "Your transaction is being processed. Please wait..."
              : successDescription || "Your transaction was successful!"}
          </div>
          {isSuccess && txId && <TransactionLink txId={txId} variant="link" />}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-4"
          >
            Close
          </Button>
        </div>
      </Dialog>
    </ShadowRoot>
  )
}
