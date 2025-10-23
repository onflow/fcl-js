import React from "react"
import {
  useFlowNftMetadata,
  type NftViewResult,
} from "../hooks/useFlowNftMetadata"
import {StyleWrapper} from "./internal/StyleWrapper"
import {ImageIcon} from "../icons/ImageIcon"
import {ExternalLinkIcon} from "../icons/ExternalLink"
import {AlertCircleIcon} from "../icons/AlertCircleIcon"
import {LoaderCircleIcon} from "../icons/LoaderCircleIcon"

interface NftCardProps {
  accountAddress: string
  tokenId: string | number
  publicPathIdentifier: string
  showTraits?: boolean
  showExtra?: boolean
}

export const NftCard: React.FC<NftCardProps> = ({
  accountAddress,
  tokenId,
  publicPathIdentifier,
  showTraits = false,
  showExtra = false,
}) => {
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

  return (
    <StyleWrapper>
      <div
        className="flow-w-full flow-max-w-sm flow-rounded-xl flow-bg-white dark:flow-bg-slate-900
          flow-overflow-hidden flow-shadow-lg hover:flow-shadow-xl flow-transition-shadow
          flow-duration-300 flow-border flow-border-slate-200 dark:flow-border-slate-800"
      >
        <div
          className="flow-relative flow-w-full flow-aspect-square flow-bg-slate-100
            dark:flow-bg-slate-800 flow-overflow-hidden"
        >
          {isLoading ? (
            <div className="flow-absolute flow-inset-0 flow-flex flow-items-center flow-justify-center">
              <LoaderCircleIcon
                className="flow-h-16 flow-w-16 flow-text-slate-400 dark:flow-text-slate-600
                  flow-animate-spin"
              />
            </div>
          ) : hasError ? (
            <div
              className="flow-absolute flow-inset-0 flow-flex flow-flex-col flow-items-center
                flow-justify-center flow-gap-3"
            >
              <AlertCircleIcon className="flow-h-16 flow-w-16 flow-text-slate-400 dark:flow-text-slate-600" />
              <p className="flow-text-sm flow-text-slate-500 dark:flow-text-slate-500 flow-font-medium">
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
              <ImageIcon className="flow-h-16 flow-w-16 flow-text-slate-400 dark:flow-text-slate-600" />
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
                      className="flow-text-xs flow-text-slate-500 dark:flow-text-slate-400 flow-uppercase
                        flow-tracking-wider flow-font-semibold flow-mb-1"
                    >
                      {nft.collectionName}
                    </p>
                  )}

                  <h3
                    className="flow-text-xl flow-font-bold flow-text-slate-900 dark:flow-text-white
                      flow-truncate flow-leading-tight"
                  >
                    {hasError
                      ? `NFT #${tokenId}`
                      : nft.name || `NFT #${tokenId}`}
                  </h3>
                </div>

                <div className="flow-flex-shrink-0 flow-self-start">
                  <span
                    className="flow-text-sm flow-font-medium flow-text-slate-400 dark:flow-text-slate-500
                      flow-whitespace-nowrap"
                  >
                    #{tokenId}
                  </span>
                </div>
              </div>
            )}

            {!isLoading && !hasError && nft.description && (
              <p
                className="flow-text-sm flow-text-slate-600 dark:flow-text-slate-400 flow-line-clamp-2
                  flow-leading-relaxed"
              >
                {nft.description}
              </p>
            )}

            {!isLoading && hasError && (
              <p className="flow-text-sm flow-text-slate-500 dark:flow-text-slate-500">
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

          {showTraits &&
            !hasError &&
            nft.traits &&
            Object.keys(nft.traits).length > 0 && (
              <div className="flow-space-y-3">
                <p
                  className="flow-text-xs flow-font-bold flow-text-slate-700 dark:flow-text-slate-300
                    flow-uppercase flow-tracking-wider"
                >
                  Traits
                </p>
                <div className="flow-grid flow-grid-cols-2 flow-gap-2">
                  {Object.entries(nft.traits)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flow-px-3 flow-py-2 flow-rounded-lg flow-bg-slate-50 dark:flow-bg-slate-800/50
                          flow-border flow-border-slate-200 dark:flow-border-slate-700"
                      >
                        <p
                          className="flow-text-xs flow-text-slate-500 dark:flow-text-slate-400 flow-truncate
                            flow-mb-0.5"
                        >
                          {key}
                        </p>
                        <p
                          className="flow-text-sm flow-font-semibold flow-text-slate-900 dark:flow-text-white
                            flow-truncate"
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  {Object.keys(nft.traits).length > 4 && (
                    <div
                      className="flow-col-span-2 flow-text-center flow-text-xs flow-text-slate-500
                        dark:flow-text-slate-400 flow-font-medium flow-mt-1"
                    >
                      +{Object.keys(nft.traits).length - 4} more traits
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </StyleWrapper>
  )
}
