import React from "react"
import {useFlowMutate} from "../hooks"
import {Button, ButtonProps} from "./internal/Button"
import {UseMutationOptions} from "@tanstack/react-query"
import {mutate} from "@onflow/fcl"
import {useGlobalTransaction} from "../provider/GlobalTransactionProvider"

interface TransactionButtonProps {
  /**
   * Transaction to execute when the button is clicked.
   * This should be a valid Flow transaction object that can be passed to `fcl.mutate`.
   * It can include Cadence code, arguments, and other transaction parameters.
   */
  transaction: Parameters<typeof mutate>[0]
  /**
   * Variant of the button, defaults to "primary".
   * Can be set to "outline" or other variants supported by the Button component.
   */
  variant?: ButtonProps["variant"]
  /**
   * Optional label for the button.
   * If not provided, the button will display a default label based on the transaction type.
   */
  label?: string
  /**
   * Optional TanStack React Query mutation options.
   * This allows you to customize the mutation behavior, such as retry logic,
   * error handling, and more.
   */
  mutation?: UseMutationOptions<string, Error, Parameters<typeof mutate>[0]>
  /**
   * Whether to disable the button. This will be combined with global transaction state.
   */
  disabled?: boolean
  /**
   * Additional CSS classes to apply to the button.
   */
  className?: string
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  variant = "primary",
  label,
  transaction,
  mutation,
  disabled = false,
  className,
}) => {
  // Get global transaction state
  const {setGlobalTxId, globalTxId} = useGlobalTransaction()

  // Standalone mutation for when not in transaction context
  const {mutate: sendTransaction, isPending} = useFlowMutate({
    mutation: {
      ...mutation,
      onSuccess: (data, variables, context) => {
        // Set the global transaction ID when the transaction is successfully sent
        setGlobalTxId(data)

        // Call the original onSuccess handler if provided
        mutation?.onSuccess?.(data, variables, context)
      },
    },
  })

  const handleButtonClick = async () => {
    sendTransaction(transaction)
  }

  // Determine loading state
  const isLoading = isPending

  // Button is disabled if: explicitly disabled, currently loading, or any global transaction is running
  const isDisabled = disabled || isLoading || !!globalTxId

  return (
    <Button
      onClick={handleButtonClick}
      variant={variant}
      className={className}
      disabled={isDisabled}
    >
      <span>
        {!isLoading ? label || "Execute Transaction" : "Processing..."}
      </span>
    </Button>
  )
}
