import {useContext} from "react"
import {PaymentsClientContext} from "../core/context"

/**
 * Hook to access the PaymentsClient from FlowProvider context
 * @returns The PaymentsClient instance or undefined if not configured
 */
export function usePaymentsClient() {
  return useContext(PaymentsClientContext)
}
