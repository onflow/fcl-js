import React from "react"
import {
  useFlowNftMetadata,
  type NftViewResult,
} from "../hooks/useFlowNftMetadata"

interface NftCardProps {
  accountAddress: string
  tokenId: string | number
  publicPathIdentifier: string
  className?: string
}

export const NftCard: React.FC<NftCardProps> = ({
  accountAddress,
  tokenId,
  publicPathIdentifier,
  className = "",
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

  if (isLoading) {
    return (
      <div
        className={`border-2 border-gray-300 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg
          transition-all rounded-lg p-4 ${className}`}
      >
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !nft) {
    return (
      <div
        className={`border-2 border-red-300 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4
          ${className}`}
      >
        <div className="text-center">
          <div
            className="bg-red-100 dark:bg-red-900/20 h-48 rounded-lg mb-4 flex items-center
              justify-center"
          >
            <svg
              className="h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            NFT Not Found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Token ID: {tokenId}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`border-2 border-gray-300 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg
        transition-all rounded-lg p-4 ${className}`}
    >
      {/* NFT Image */}
      <div className="mb-4 relative">
        {getThumbnailUrl(nft) ? (
          <img
            src={getThumbnailUrl(nft)!}
            alt={nft.name || `NFT ${tokenId}`}
            className="w-full h-48 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
            onError={e => {
              const target = e.target as HTMLImageElement
              target.style.display = "none"
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) {
                fallback.classList.remove("hidden")
              }
            }}
          />
        ) : null}
        <div
          className={`w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center
            justify-center ${getThumbnailUrl(nft) ? "hidden" : ""}`}
        >
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* NFT Info */}
      <div className="space-y-3">
        {/* Name and Token ID */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
            {nft.name || `NFT #${tokenId}`}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100
                text-gray-800 dark:bg-gray-700 dark:text-gray-200 border"
            >
              ID: {tokenId}
            </span>
            {nft.collectionName && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100
                  text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
              >
                {nft.collectionName}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {nft.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {nft.description}
          </p>
        )}

        {/* External Links */}
        {(nft.collectionExternalUrl || nft.externalUrl) && (
          <div className="flex gap-2">
            {nft.collectionExternalUrl && (
              <a
                href={nft.collectionExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400
                  hover:underline"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Collection
              </a>
            )}
            {nft.externalUrl && (
              <a
                href={nft.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400
                  hover:underline"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View NFT
              </a>
            )}
          </div>
        )}

        {/* Rarity and Serial Number */}
        {(nft.rarity || nft.serialNumber) && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 flex-wrap">
              {nft.rarity && (
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Rarity
                  </p>
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border"
                  >
                    {nft.rarity}
                  </span>
                </div>
              )}
              {nft.serialNumber && (
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                    Serial
                  </p>
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100
                      text-green-800 dark:bg-green-900/50 dark:text-green-200 border"
                  >
                    #{nft.serialNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Traits */}
        {nft.traits && Object.keys(nft.traits).length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Traits
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
              {Object.entries(nft.traits)
                .slice(0, 6)
                .map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <p className="font-medium text-gray-600 dark:text-gray-400 truncate">
                      {key}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 truncate">
                      {value}
                    </p>
                  </div>
                ))}
              {Object.keys(nft.traits).length > 6 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 col-span-2">
                  +{Object.keys(nft.traits).length - 6} more traits
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
