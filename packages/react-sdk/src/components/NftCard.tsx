import React, {useEffect} from "react"
import {useFlowNftMetadata, type NftViewResult} from "@onflow/react-core"
import {StyleWrapper} from "./internal/StyleWrapper"
import {ImageIcon} from "../icons/ImageIcon"
import {ExternalLinkIcon} from "../icons/ExternalLink"
import {AlertCircleIcon} from "../icons/AlertCircleIcon"
import {LoaderCircleIcon} from "../icons/LoaderCircleIcon"
import {MoreVerticalIcon} from "../icons/MoreVerticalIcon"
import {Dialog} from "./internal/Dialog"
import {Button} from "./internal/Button"
import {twMerge} from "tailwind-merge"
import {useTheme} from "../core/theme"

export interface NftCardAction {
  title: string
  onClick: () => Promise<void> | void
}

interface NftCardProps {
  accountAddress: string
  tokenId: string | number
  publicPathIdentifier: string
  showTraits?: boolean
  showExtra?: boolean
  actions?: NftCardAction[]
  className?: string
  style?: React.CSSProperties
}

export const NftCard: React.FC<NftCardProps> = ({
  accountAddress,
  tokenId,
  publicPathIdentifier,
  showTraits = false,
  showExtra = false,
  actions,
  className,
  style,
}) => {
  const [showTraitsModal, setShowTraitsModal] = React.useState(false)
  const [actionLoading, setActionLoading] = React.useState<number | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const {colors} = useTheme()

  const {
    data: nft,
    isLoading,
    error,
  } = useFlowNftMetadata({
    accountAddress,
    tokenId,
    publicPathIdentifier,
  })

  const getThumbnailUrl = (nft: NftViewResult | null) => {
    if (!nft || !nft.thumbnailUrl) return null
    return nft.thumbnailUrl
  }

  const hasError = error || !nft
  const hasImage = !hasError && getThumbnailUrl(nft)
  const totalTraits =
    !hasError && nft?.traits ? Object.keys(nft.traits).length : 0

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isDropdownOpen])

  return (
    <StyleWrapper>
      <div
        className={twMerge(
          "flow-w-full flow-rounded-lg flow-overflow-hidden",
          "flow-shadow-lg hover:flow-shadow-xl flow-transition-shadow",
          "flow-duration-300 flow-border",
          colors.background,
          colors.border,
          className
        )}
        style={style}
      >
        <div className="flow-relative">
          <div
            className={twMerge(
              "flow-relative flow-w-full flow-aspect-square flow-overflow-hidden",
              colors.secondary
            )}
          >
            {isLoading ? (
              <div className="flow-absolute flow-inset-0 flow-flex flow-items-center flow-justify-center">
                <LoaderCircleIcon
                  className={twMerge(
                    "flow-h-16 flow-w-16 flow-animate-spin",
                    colors.mutedForeground
                  )}
                />
              </div>
            ) : hasError ? (
              <div
                className="flow-absolute flow-inset-0 flow-flex flow-flex-col flow-items-center
                  flow-justify-center flow-gap-3"
              >
                <AlertCircleIcon
                  className={twMerge(
                    "flow-h-16 flow-w-16",
                    colors.mutedForeground
                  )}
                />
                <p
                  className={twMerge(
                    "flow-text-sm flow-font-medium",
                    colors.mutedForeground
                  )}
                >
                  Failed to load NFT
                </p>
              </div>
            ) : hasImage ? (
              <img
                src={getThumbnailUrl(nft)!}
                alt={nft.name || `NFT #${tokenId}`}
                className="flow-absolute flow-inset-0 flow-w-full flow-h-full flow-object-cover"
              />
            ) : (
              <div className="flow-absolute flow-inset-0 flow-flex flow-items-center flow-justify-center">
                <ImageIcon
                  className={twMerge(
                    "flow-h-16 flow-w-16",
                    colors.mutedForeground
                  )}
                />
              </div>
            )}
          </div>

          {actions && actions.length > 0 && (
            <div className="flow-absolute flow-top-2 flow-right-2 flow-z-[2]">
              <div
                ref={dropdownRef}
                className="flow-relative flow-inline-block"
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setIsDropdownOpen(!isDropdownOpen)
                    }
                  }}
                  className="flow-p-2 flow-rounded-full flow-bg-white/80 dark:flow-bg-slate-900/80
                    flow-backdrop-blur-sm flow-border flow-border-slate-200
                    dark:flow-border-slate-700 hover:flow-bg-white dark:hover:flow-bg-slate-900
                    flow-transition-colors flow-shadow-sm hover:flow-shadow-md
                    focus:flow-outline-none"
                  aria-label="Actions menu"
                  aria-expanded={isDropdownOpen}
                >
                  <MoreVerticalIcon
                    className={twMerge("flow-h-4 flow-w-4", colors.foreground)}
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    className={twMerge(
                      "flow-absolute flow-top-full flow-mt-2 flow-w-52 flow-rounded-lg",
                      "flow-shadow-sm hover:flow-shadow-md flow-border flow-p-1 flow-origin-top-right",
                      colors.background,
                      colors.border
                    )}
                    style={{right: "0px"}}
                  >
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={async e => {
                          e.stopPropagation()
                          setActionLoading(index)
                          try {
                            await action.onClick()
                            setIsDropdownOpen(false)
                          } finally {
                            setActionLoading(null)
                          }
                        }}
                        disabled={actionLoading !== null}
                        className="flow-w-full flow-text-left flow-px-3 flow-py-2.5 flow-text-sm flow-font-medium
                          flow-transition-all flow-duration-150 flow-flex flow-items-center
                          flow-justify-between flow-gap-2 flow-text-slate-700 dark:flow-text-slate-300
                          hover:flow-bg-slate-100 dark:hover:flow-bg-slate-700/50
                          hover:flow-text-slate-900 dark:hover:flow-text-white focus:flow-bg-slate-100
                          dark:focus:flow-bg-slate-700/50 focus:flow-text-slate-900
                          dark:focus:flow-text-white focus:flow-outline-none disabled:flow-opacity-50
                          disabled:flow-cursor-not-allowed flow-rounded-lg"
                      >
                        <span className="flow-truncate">{action.title}</span>
                        {actionLoading === index && (
                          <LoaderCircleIcon
                            className={twMerge(
                              "flow-h-4 flow-w-4 flow-flex-shrink-0 flow-animate-spin",
                              colors.mutedForeground
                            )}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flow-p-6 flow-space-y-4">
          <div className="flow-space-y-2">
            {isLoading ? (
              <>
                <div className="flow-flex flow-items-start flow-justify-between flow-gap-4">
                  <div className="flow-flex-1 flow-min-w-0 flow-pr-2">
                    <div
                      className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-3 flow-rounded flow-w-1/3
                        flow-mb-2 flow-animate-pulse"
                    ></div>
                    <div
                      className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-6 flow-rounded flow-w-3/4
                        flow-animate-pulse"
                    ></div>
                  </div>
                  <div className="flow-flex-shrink-0 flow-self-start">
                    <div
                      className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-5 flow-rounded flow-w-12
                        flow-animate-pulse"
                    ></div>
                  </div>
                </div>
                <div
                  className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-4 flow-rounded flow-w-full
                    flow-animate-pulse"
                ></div>
                <div
                  className="flow-bg-slate-200 dark:flow-bg-slate-700 flow-h-4 flow-rounded flow-w-5/6
                    flow-animate-pulse"
                ></div>
              </>
            ) : (
              <div className="flow-flex flow-items-start flow-justify-between flow-gap-4">
                <div className="flow-flex-1 flow-min-w-0 flow-pr-2">
                  {!hasError && nft.collectionName && (
                    <p
                      className={twMerge(
                        "flow-text-xs flow-uppercase flow-tracking-wider flow-font-semibold flow-mb-1",
                        colors.mutedForeground
                      )}
                    >
                      {nft.collectionName}
                    </p>
                  )}

                  <h3
                    className={twMerge(
                      "flow-text-xl flow-font-bold flow-truncate flow-leading-tight",
                      colors.foreground
                    )}
                  >
                    {hasError
                      ? `NFT #${tokenId}`
                      : nft.name || `NFT #${tokenId}`}
                  </h3>
                </div>

                <div className="flow-flex-shrink-0 flow-self-start">
                  <span
                    className={twMerge(
                      "flow-text-sm flow-font-medium flow-whitespace-nowrap",
                      colors.mutedForeground
                    )}
                  >
                    #{tokenId}
                  </span>
                </div>
              </div>
            )}

            {!isLoading && !hasError && nft.description && (
              <p
                className={twMerge(
                  "flow-text-sm flow-line-clamp-2 flow-leading-relaxed",
                  colors.mutedForeground
                )}
              >
                {nft.description}
              </p>
            )}

            {!isLoading && hasError && (
              <p className={twMerge("flow-text-sm", colors.mutedForeground)}>
                Unable to load NFT metadata
              </p>
            )}
          </div>

          {showExtra &&
            !hasError &&
            (nft.serialNumber ||
              nft.rarity ||
              nft.externalUrl ||
              nft.collectionExternalUrl) && (
              <div className="flow-flex flow-flex-wrap flow-gap-2">
                {nft.serialNumber && (
                  <span
                    className="flow-inline-flex flow-items-center flow-px-3 flow-py-1.5 flow-rounded-full
                      flow-text-xs flow-font-semibold flow-bg-blue-50 dark:flow-bg-blue-900/20
                      flow-text-blue-700 dark:flow-text-blue-400 flow-border flow-border-blue-200
                      dark:flow-border-blue-800"
                  >
                    Serial #{nft.serialNumber}
                  </span>
                )}

                {nft.rarity && (
                  <span
                    className="flow-inline-flex flow-items-center flow-px-3 flow-py-1.5 flow-rounded-full
                      flow-text-xs flow-font-semibold flow-bg-purple-50 dark:flow-bg-purple-900/20
                      flow-text-purple-700 dark:flow-text-purple-400 flow-border
                      flow-border-purple-200 dark:flow-border-purple-800"
                  >
                    {nft.rarity}
                  </span>
                )}

                {(nft.externalUrl || nft.collectionExternalUrl) && (
                  <a
                    href={nft.externalUrl || nft.collectionExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flow-inline-flex flow-items-center flow-gap-1.5 flow-px-3 flow-py-1.5
                      flow-rounded-full flow-text-xs flow-font-semibold flow-bg-slate-100
                      dark:flow-bg-slate-800 flow-text-slate-700 dark:flow-text-slate-300
                      hover:flow-bg-slate-200 dark:hover:flow-bg-slate-700 flow-transition-colors
                      flow-border flow-border-slate-200 dark:flow-border-slate-700"
                  >
                    <ExternalLinkIcon className="flow-h-3.5 flow-w-3.5" />
                    View
                  </a>
                )}
              </div>
            )}

          {showTraits && !hasError && nft.traits && totalTraits > 0 && (
            <div className="flow-space-y-3">
              <p
                className={twMerge(
                  "flow-text-xs flow-font-bold flow-uppercase flow-tracking-wider",
                  colors.foreground
                )}
              >
                Traits
              </p>
              <div className="flow-grid flow-grid-cols-2 flow-gap-2">
                {Object.entries(nft.traits)
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className={twMerge(
                        "flow-px-3 flow-py-2 flow-rounded-lg flow-border",
                        colors.muted,
                        colors.border
                      )}
                    >
                      <p
                        className={twMerge(
                          "flow-text-xs flow-truncate flow-mb-0.5",
                          colors.mutedForeground
                        )}
                      >
                        {key}
                      </p>
                      <p
                        className={twMerge(
                          "flow-text-sm flow-font-semibold flow-truncate",
                          colors.foreground
                        )}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                {totalTraits > 4 && (
                  <Button
                    variant="secondary"
                    onClick={() => setShowTraitsModal(true)}
                    className="flow-col-span-2 flow-text-xs"
                  >
                    Show all ({totalTraits}) traits
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        isOpen={showTraitsModal}
        onClose={() => setShowTraitsModal(false)}
        title={`NFT #${tokenId} Traits`}
      >
        <div
          className="flow-overflow-y-auto flow-pr-2"
          style={{
            maxHeight: totalTraits > 6 ? "70vh" : "auto",
          }}
        >
          <div className="flow-grid flow-grid-cols-2 flow-gap-3">
            {!hasError &&
              nft.traits &&
              Object.entries(nft.traits).map(([key, value]) => (
                <div
                  key={key}
                  className={twMerge(
                    "flow-px-3 flow-py-2 flow-rounded-lg flow-border",
                    colors.muted,
                    colors.border
                  )}
                >
                  <p
                    className={twMerge(
                      "flow-text-xs flow-truncate flow-mb-0.5",
                      colors.mutedForeground
                    )}
                  >
                    {key}
                  </p>
                  <p
                    className={twMerge(
                      "flow-text-sm flow-font-semibold flow-truncate",
                      colors.foreground
                    )}
                  >
                    {value}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </Dialog>
    </StyleWrapper>
  )
}
