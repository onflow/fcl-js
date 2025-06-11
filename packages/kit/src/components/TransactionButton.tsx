import React from "react"
import {useFlowMutate} from "../hooks"
import {Button, ButtonProps} from "./internal/Button"
import {UseMutationOptions} from "@tanstack/react-query"
import {mutate} from "@onflow/fcl"

interface TransactionButtonProps {
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
   * Transaction to execute when the button is clicked.
   * This should be a valid Flow transaction object that can be passed to `fcl.mutate`.
   * It can include Cadence code, arguments, and other transaction parameters.
   */
  transaction: Parameters<typeof mutate>[0]
  /**
   * Optional TanStack React Query mutation options.
   * This allows you to customize the mutation behavior, such as retry logic,
   * error handling, and more.
   */
  mutation?: Omit<
    UseMutationOptions<string, Error, Parameters<typeof mutate>[0]>,
    "mutationFn"
  >
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  variant = "primary",
  label,
  transaction,
  mutation,
}) => {
  const {mutate: sendTransaction} = useFlowMutate({
    mutation,
  })

  const handleButtonClick = async () => {
    sendTransaction(transaction)
  }

  return (
    <Button onClick={handleButtonClick} variant={variant} className="px-2">
      {label || "Send Transaction"}
    </Button>
  )
}
