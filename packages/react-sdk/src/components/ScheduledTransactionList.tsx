import React from "react"
import {
  useFlowScheduledTransactionList,
  UseFlowScheduledTransactionListArgs,
  ScheduledTransaction,
  ScheduledTransactionPriority,
  ScheduledTransactionStatus,
} from "@onflow/react-core"
import {useFlowScheduledTransactionCancel} from "@onflow/react-core"
import {StyleWrapper} from "./internal/StyleWrapper"
import {AlertCircleIcon} from "../icons/AlertCircleIcon"
import {LoaderCircleIcon} from "../icons/LoaderCircleIcon"
import {TrashIcon} from "../icons/TrashIcon"
import {FlowIcon} from "../icons/FlowIcon"
import {ExternalLinkIcon} from "../icons/ExternalLink"
import {twMerge} from "tailwind-merge"
import {useFlowQueryClient} from "@onflow/react-core"
import {useFlowChainId} from "@onflow/react-core"
import {getFlowscanScheduledTxUrl} from "@onflow/react-core"

const getPriorityLabel = (priority: ScheduledTransactionPriority): string => {
  switch (priority) {
    case ScheduledTransactionPriority.Low:
      return "Low"
    case ScheduledTransactionPriority.Medium:
      return "Medium"
    case ScheduledTransactionPriority.High:
      return "High"
    default:
      return "Unknown"
  }
}

const getPriorityColor = (priority: ScheduledTransactionPriority): string => {
  switch (priority) {
    case ScheduledTransactionPriority.Low:
      return "flow-bg-slate-100 dark:flow-bg-slate-800 flow-text-slate-700 dark:flow-text-slate-300"
    case ScheduledTransactionPriority.Medium:
      return "flow-bg-yellow-100 dark:flow-bg-yellow-900/30 flow-text-yellow-700 dark:flow-text-yellow-400"
    case ScheduledTransactionPriority.High:
      return "flow-bg-red-100 dark:flow-bg-red-900/30 flow-text-red-700 dark:flow-text-red-400"
    default:
      return "flow-bg-slate-100 dark:flow-bg-slate-800 flow-text-slate-700 dark:flow-text-slate-300"
  }
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getThumbnailUrl = (thumbnail: any): string => {
  if (!thumbnail) return ""
  if (thumbnail.url) return thumbnail.url
  if (thumbnail.cid)
    return `https://ipfs.io/ipfs/${thumbnail.cid}${thumbnail.path || ""}`
  return ""
}

const extractMetadataDisplay = (handlerResolvedViews?: {
  [viewType: string]: any
}): {
  name?: string
  description?: string
  thumbnail?: string
} => {
  if (!handlerResolvedViews) return {}

  // Find MetadataViews.Display - match the full type name
  const displayView = Object.entries(handlerResolvedViews).find(([key]) =>
    key.includes("MetadataViews.Display")
  )

  if (displayView && displayView[1]) {
    const view = displayView[1]
    const thumbnailUrl = getThumbnailUrl(view.thumbnail)

    return {
      name: view.name || undefined,
      description: view.description || undefined,
      thumbnail: thumbnailUrl || undefined,
    }
  }

  return {}
}

interface ScheduledTransactionCardProps {
  transaction: ScheduledTransaction
  cancelEnabled?: boolean
  onCancelSuccess?: () => void
  className?: string
}

const ScheduledTransactionCard: React.FC<ScheduledTransactionCardProps> = ({
  transaction,
  cancelEnabled = true,
  onCancelSuccess,
  className,
}) => {
  const {cancelTransactionAsync, isPending} =
    useFlowScheduledTransactionCancel()
  const {data: chainId} = useFlowChainId()

  const metadata = extractMetadataDisplay(transaction.handlerResolvedViews)

  const handleCancel = async () => {
    try {
      await cancelTransactionAsync(transaction.id)
      onCancelSuccess?.()
    } catch (error) {
      console.error("Failed to cancel transaction:", error)
    }
  }

  const canCancel =
    cancelEnabled &&
    (transaction.status === ScheduledTransactionStatus.Pending ||
      transaction.status === ScheduledTransactionStatus.Processing)

  return (
    <div
      className={twMerge(
        "flow-w-full flow-rounded-lg flow-relative flow-group",
        "flow-bg-white dark:flow-bg-gray-900/50",
        "flow-border flow-border-black/5 dark:flow-border-white/10",
        "flow-transition-colors flow-duration-200",
        className
      )}
    >
      <div className="flow-flex flow-items-start flow-gap-2 sm:flow-gap-3 flow-p-2 sm:flow-p-3">
        {metadata.thumbnail && (
          <div
            className="max-sm:flow-hidden flow-flex-shrink-0 flow-w-16 flow-h-16 flow-rounded
              flow-bg-slate-100 dark:flow-bg-slate-800 flow-overflow-hidden"
          >
            <img
              src={metadata.thumbnail}
              alt={metadata.name || "Transaction"}
              className="flow-w-full flow-h-full flow-object-cover"
            />
          </div>
        )}

        <div className="flow-flex-1 flow-min-w-0 flow-pr-10 sm:flow-pr-12">
          <div className="flow-flex flow-items-center flow-gap-2 flow-mb-0.5 flow-flex-wrap">
            <h3
              className="flow-text-sm flow-font-semibold flow-text-slate-900 dark:flow-text-white
                flow-truncate flow-flex-shrink flow-min-w-0"
              title={metadata.name || "Scheduled Transaction"}
            >
              {metadata.name || "Scheduled Transaction"}
            </h3>
            <span
              className="flow-text-xs flow-font-mono flow-text-slate-500 dark:flow-text-slate-400
                flow-flex-shrink-0"
              title={`Transaction ID: ${transaction.id}`}
            >
              #{transaction.id.slice(0, 8)}
            </span>
          </div>

          {metadata.description && (
            <p
              className="flow-text-xs flow-text-slate-500 dark:flow-text-slate-400 flow-truncate
                flow-mb-2"
              title={metadata.description}
            >
              {metadata.description}
            </p>
          )}

          <div
            className="flow-flex flow-items-center flow-flex-wrap flow-gap-2 sm:flow-gap-2.5
              flow-text-[10px] flow-text-slate-600 dark:flow-text-slate-400 flow-mt-2"
          >
            <div
              className={twMerge(
                "flow-inline-flex flow-items-center flow-gap-1 flow-px-2 flow-py-0.5",
                "flow-rounded-full flow-font-semibold",
                getPriorityColor(transaction.priority)
              )}
              title="Priority"
            >
              <span
                className={twMerge(
                  "flow-w-1.5 flow-h-1.5 flow-rounded-full",
                  transaction.priority === ScheduledTransactionPriority.High
                    ? "flow-bg-red-500 dark:flow-bg-red-400"
                    : transaction.priority ===
                        ScheduledTransactionPriority.Medium
                      ? "flow-bg-yellow-500 dark:flow-bg-yellow-400"
                      : "flow-bg-slate-400 dark:flow-bg-slate-500"
                )}
              />
              {getPriorityLabel(transaction.priority)}
            </div>

            <div
              className="flow-flex flow-items-center flow-gap-1"
              title="Scheduled time"
            >
              <svg
                className="flow-h-3.5 flow-w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="flow-font-medium">
                {formatTimestamp(transaction.scheduledTimestamp)}
              </span>
            </div>

            <div
              className="flow-flex flow-items-center flow-gap-1"
              title="Execution effort"
            >
              <svg
                className="flow-h-3.5 flow-w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="flow-font-medium">
                {transaction.executionEffort.toString()}
              </span>
            </div>

            <div className="flow-flex flow-items-center flow-gap-1" title="Fee">
              <FlowIcon className="flow-h-3.5 flow-w-3.5" />
              <span className="flow-font-medium">
                {transaction.fees.formatted}
              </span>
            </div>
          </div>
        </div>

        <div
          className="flow-absolute flow-right-2 sm:flow-right-2 flow-top-2 sm:flow-top-3 flow-flex
            flow-flex-col flow-items-end flow-gap-1"
        >
          {canCancel && (
            <div
              className="flow-opacity-0 group-hover:flow-opacity-100 flow-transition-opacity"
              title={isPending ? "Cancelling..." : "Cancel transaction"}
            >
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="flow-h-6 flow-w-6 flow-p-0 flow-rounded-full flow-flex flow-items-center
                  flow-justify-center flow-bg-transparent flow-border flow-border-slate-200
                  dark:flow-border-slate-700 hover:flow-border-red-500
                  dark:hover:flow-border-red-500 flow-transition-colors disabled:flow-opacity-50
                  disabled:flow-cursor-not-allowed"
              >
                {isPending ? (
                  <LoaderCircleIcon className="flow-h-3 flow-w-3 flow-text-red-500 flow-animate-spin" />
                ) : (
                  <TrashIcon className="flow-h-3 flow-w-3 flow-text-red-500" />
                )}
              </button>
            </div>
          )}

          <a
            href={getFlowscanScheduledTxUrl(transaction.id, chainId) || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flow-h-6 flow-w-6 flow-p-0 flow-rounded-full flow-flex flow-items-center
              flow-justify-center flow-text-slate-400 dark:flow-text-slate-500
              hover:flow-text-slate-600 dark:hover:flow-text-slate-400 flow-transition-colors"
            title="View on Flowscan"
          >
            <ExternalLinkIcon className="flow-h-3.5 flow-w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

interface ScheduledTransactionListProps {
  address: string
  filterHandlerTypes?: string[]
  cancelEnabled?: boolean
  className?: string
  style?: React.CSSProperties
  flowClient?: UseFlowScheduledTransactionListArgs["flowClient"]
}

export const ScheduledTransactionList: React.FC<
  ScheduledTransactionListProps
> = ({
  address,
  filterHandlerTypes,
  cancelEnabled = true,
  className,
  style,
  flowClient,
}) => {
  const queryClient = useFlowQueryClient()

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useFlowScheduledTransactionList({
    account: address,
    includeHandlerData: true,
    flowClient,
  })

  const handleCancelSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["flowQuery"],
      exact: false,
    })
    refetch()
  }

  const filteredTransactions =
    filterHandlerTypes && transactions
      ? transactions.filter(tx =>
          filterHandlerTypes.includes(tx.handlerTypeIdentifier)
        )
      : transactions

  const sortedTransactions = filteredTransactions
    ? [...filteredTransactions].sort((a, b) => {
        if (a.scheduledTimestamp !== b.scheduledTimestamp) {
          return a.scheduledTimestamp - b.scheduledTimestamp
        }
        return b.priority - a.priority
      })
    : filteredTransactions

  return (
    <StyleWrapper>
      <div
        className={twMerge(
          "flow-w-full flow-h-full flow-flex flow-flex-col",
          className
        )}
        style={style}
      >
        <div className="flow-flex-1">
          {isLoading ? (
            <div className="flow-space-y-2 flow-py-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="flow-w-full flow-rounded-lg flow-relative flow-bg-gray-50
                    dark:flow-bg-gray-900/50 flow-border flow-border-black/5
                    dark:flow-border-white/10 flow-animate-pulse"
                >
                  <div className="flow-flex flow-items-center flow-gap-3 flow-p-3">
                    <div
                      className="flow-flex-shrink-0 flow-w-12 flow-h-12 flow-rounded flow-bg-slate-200
                        dark:flow-bg-slate-700"
                    ></div>
                    <div className="flow-flex-1 flow-min-w-0 flow-space-y-2">
                      <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-4 flow-rounded flow-w-1/3"></div>
                      <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-3 flow-rounded flow-w-2/3"></div>
                    </div>
                    <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-8 flow-w-8 flow-rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div
              className="flow-flex flow-flex-col flow-items-center flow-justify-center flow-h-full
                flow-gap-3 flow-py-12"
            >
              <AlertCircleIcon className="flow-h-16 flow-w-16 flow-text-slate-400 dark:flow-text-slate-600" />
              <p className="flow-text-sm flow-text-slate-500 dark:flow-text-slate-500 flow-font-medium">
                Failed to load scheduled transactions
              </p>
              <p
                className="flow-text-xs flow-text-slate-400 dark:flow-text-slate-600 flow-max-w-md
                  flow-text-center"
              >
                An error occurred.
              </p>
            </div>
          ) : !sortedTransactions || sortedTransactions.length === 0 ? (
            <div
              className="flow-flex flow-flex-col flow-items-center flow-justify-center flow-h-full
                flow-gap-3 flow-py-12"
            >
              <div
                className="flow-h-16 flow-w-16 flow-rounded-full flow-bg-slate-200 dark:flow-bg-slate-800
                  flow-flex flow-items-center flow-justify-center"
              >
                <svg
                  className="flow-h-8 flow-w-8 flow-text-slate-400 dark:flow-text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <p className="flow-text-sm flow-text-slate-500 dark:flow-text-slate-500 flow-font-medium">
                No scheduled transactions
              </p>
            </div>
          ) : (
            <div className="flow-space-y-2">
              {sortedTransactions.map(transaction => (
                <ScheduledTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onCancelSuccess={handleCancelSuccess}
                  cancelEnabled={cancelEnabled}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </StyleWrapper>
  )
}
