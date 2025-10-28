import React from "react"
import {
  useFlowScheduledTransactionList,
  UseFlowScheduledTransactionListArgs,
  ScheduledTransaction,
  ScheduledTransactionPriority,
  ScheduledTransactionStatus,
} from "../hooks/useFlowScheduledTransactionList"
import {useFlowScheduledTransactionCancel} from "../hooks/useFlowScheduledTransactionCancel"
import {StyleWrapper} from "./internal/StyleWrapper"
import {AlertCircleIcon} from "../icons/AlertCircleIcon"
import {LoaderCircleIcon} from "../icons/LoaderCircleIcon"
import {TrashIcon} from "../icons/TrashIcon"
import {FlowIcon} from "../icons/FlowIcon"
import {Button} from "./internal/Button"
import {twMerge} from "tailwind-merge"
import {useFlowQueryClient} from "../provider/FlowQueryClient"

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
  onCancelSuccess?: () => void
  className?: string
}

const ScheduledTransactionCard: React.FC<ScheduledTransactionCardProps> = ({
  transaction,
  onCancelSuccess,
  className,
}) => {
  const {cancelTransactionAsync, isPending} =
    useFlowScheduledTransactionCancel()

  const metadata = extractMetadataDisplay(transaction.handlerResolvedViews)
  const hasMetadata = !!(metadata.name || metadata.description)

  const handleCancel = async () => {
    try {
      await cancelTransactionAsync(transaction.id)
      onCancelSuccess?.()
    } catch (error) {
      console.error("Failed to cancel transaction:", error)
    }
  }

  const canCancel =
    transaction.status === ScheduledTransactionStatus.Pending ||
    transaction.status === ScheduledTransactionStatus.Processing

  return (
    <div
      className={twMerge(
        "flow-w-full flow-rounded-xl flow-bg-white dark:flow-bg-slate-900",
        "flow-border flow-border-slate-200 dark:flow-border-slate-800",
        "flow-shadow-lg hover:flow-shadow-xl flow-transition-shadow flow-duration-300",
        "flow-overflow-hidden",
        className
      )}
    >
      <div className="flow-flex flow-gap-4 flow-p-5">
        {metadata.thumbnail && (
          <div
            className="flow-flex-shrink-0 flow-w-24 flow-h-24 flow-rounded-lg flow-bg-slate-100
              dark:flow-bg-slate-800 flow-overflow-hidden"
          >
            <img
              src={metadata.thumbnail}
              alt={metadata.name || "Transaction"}
              className="flow-w-full flow-h-full flow-object-cover"
            />
          </div>
        )}

        <div className="flow-flex-1 flow-min-w-0 flow-space-y-3">
          <div className="flow-flex flow-items-start flow-justify-between flow-gap-3">
            <div className="flow-flex-1 flow-min-w-0">
              {hasMetadata ? (
                <div className="flow-space-y-1">
                  <h3
                    className="flow-text-lg flow-font-bold flow-text-slate-900 dark:flow-text-white
                      flow-truncate"
                  >
                    {metadata.name}
                  </h3>
                  {metadata.description && (
                    <p className="flow-text-sm flow-text-slate-600 dark:flow-text-slate-400 flow-line-clamp-2">
                      {metadata.description}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flow-space-y-1">
                  <div className="flow-flex flow-items-baseline flow-gap-2 flow-flex-wrap">
                    <h3 className="flow-text-lg flow-font-bold flow-text-slate-900 dark:flow-text-white">
                      Scheduled Transaction
                    </h3>
                    <span className="flow-text-sm flow-font-mono flow-text-slate-500 dark:flow-text-slate-400">
                      #{transaction.id}
                    </span>
                  </div>
                  <p className="flow-text-sm flow-text-slate-600 dark:flow-text-slate-400 flow-truncate">
                    {transaction.handlerTypeIdentifier}
                  </p>
                </div>
              )}
            </div>

            {canCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                className="flow-flex flow-items-center flow-gap-1.5 flow-px-3 flow-py-1.5 flow-text-sm
                  hover:flow-bg-red-50 dark:hover:flow-bg-red-900/20 hover:flow-text-red-700
                  dark:hover:flow-text-red-400 hover:flow-border-red-300
                  dark:hover:flow-border-red-800 flow-transition-colors flow-flex-shrink-0"
              >
                {isPending ? (
                  <>
                    <LoaderCircleIcon className="flow-h-4 flow-w-4 flow-animate-spin" />
                    <span className="flow-hidden sm:flow-inline">
                      Cancelling...
                    </span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="flow-h-4 flow-w-4" />
                    <span className="flow-hidden sm:flow-inline">Cancel</span>
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flow-flex flow-items-center flow-gap-3 flow-flex-wrap">
            <div className="flow-flex flow-items-center flow-gap-2">
              <span className="flow-text-xs flow-text-slate-500 dark:flow-text-slate-400 flow-font-medium">
                Scheduled at:
              </span>
              <p className="flow-text-base flow-font-bold flow-text-slate-900 dark:flow-text-white">
                {formatTimestamp(transaction.scheduledTimestamp)}
              </p>
            </div>
            <div className="flow-flex flow-items-center flow-gap-1">
              <span className="flow-text-xs flow-text-slate-500 dark:flow-text-slate-400 flow-font-medium">
                Fee:
              </span>
              <FlowIcon className="flow-h-4 flow-w-4 flow-flex-shrink-0" />
              <p className="flow-text-sm flow-font-semibold flow-text-slate-900 dark:flow-text-white">
                {transaction.fees.formatted}
              </p>
            </div>
          </div>

          <div className="flow-flex flow-flex-wrap flow-gap-2 flow-items-center">
            <div
              className={twMerge(
                "flow-inline-flex flow-items-center flow-gap-1.5 flow-px-2.5 flow-py-1",
                "flow-rounded-full flow-text-xs flow-font-semibold",
                getPriorityColor(transaction.priority)
              )}
            >
              <span
                className={twMerge(
                  "flow-w-2 flow-h-2 flow-rounded-full",
                  transaction.priority === ScheduledTransactionPriority.High
                    ? "flow-bg-red-500 dark:flow-bg-red-400"
                    : transaction.priority ===
                        ScheduledTransactionPriority.Medium
                      ? "flow-bg-yellow-500 dark:flow-bg-yellow-400"
                      : "flow-bg-slate-400 dark:flow-bg-slate-500"
                )}
              />
              {getPriorityLabel(transaction.priority)} Priority
            </div>

            <div
              className="flow-inline-flex flow-items-center flow-gap-1 flow-px-2.5 flow-py-1
                flow-rounded-full flow-bg-slate-100 dark:flow-bg-slate-800 flow-text-xs
                flow-font-medium flow-text-slate-700 dark:flow-text-slate-300"
            >
              Effort: {transaction.executionEffort.toString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ScheduledTransactionListProps {
  address: string
  filterHandlerTypes?: string[]
  className?: string
  style?: React.CSSProperties
  flowClient?: UseFlowScheduledTransactionListArgs["flowClient"]
}

export const ScheduledTransactionList: React.FC<
  ScheduledTransactionListProps
> = ({address, filterHandlerTypes, className, style, flowClient}) => {
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
        <div className="flow-flex-1 flow-overflow-y-auto flow-px-2">
          {isLoading ? (
            <div className="flow-space-y-4 flow-py-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="flow-w-full flow-rounded-xl flow-bg-white dark:flow-bg-slate-900 flow-border
                    flow-border-slate-200 dark:flow-border-slate-800 flow-shadow-lg
                    flow-overflow-hidden flow-animate-pulse"
                >
                  <div className="flow-flex flow-gap-4 flow-p-5">
                    <div
                      className="flow-flex-shrink-0 flow-w-24 flow-h-24 flow-rounded-lg flow-bg-slate-200
                        dark:flow-bg-slate-700"
                    ></div>
                    <div className="flow-flex-1 flow-min-w-0 flow-space-y-3">
                      <div className="flow-flex flow-items-start flow-justify-between flow-gap-3">
                        <div className="flow-flex-1 flow-min-w-0 flow-space-y-2">
                          <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-5 flow-rounded flow-w-3/4"></div>
                          <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-4 flow-rounded flow-w-full"></div>
                        </div>
                        <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-8 flow-rounded flow-w-20"></div>
                      </div>

                      <div className="flow-flex flow-items-center flow-gap-3 flow-flex-wrap">
                        <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-5 flow-rounded flow-w-56"></div>
                        <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-5 flow-rounded flow-w-24"></div>
                      </div>

                      <div className="flow-flex flow-gap-2">
                        <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-6 flow-rounded-full flow-w-24"></div>
                        <div className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-6 flow-rounded-full flow-w-16"></div>
                      </div>
                    </div>
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
            <div className="flow-space-y-4 flow-py-2">
              {sortedTransactions.map(transaction => (
                <ScheduledTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onCancelSuccess={handleCancelSuccess}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </StyleWrapper>
  )
}
