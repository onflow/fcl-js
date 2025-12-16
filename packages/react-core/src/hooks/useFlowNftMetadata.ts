import type {FlowClientCore} from "@onflow/fcl-core"
import {UseQueryOptions, UseQueryResult} from "@tanstack/react-query"
import {useFlowQuery} from "./useFlowQuery"
import {CONTRACT_ADDRESSES} from "../constants"
import {useFlowChainId} from "./useFlowChainId"

export interface NftViewResult {
  name: string
  description: string
  thumbnailUrl: string
  externalUrl?: string
  collectionName?: string
  collectionExternalUrl?: string
  tokenID: string
  traits?: Record<string, string>
  rarity?: string
  serialNumber?: string
}

interface UseFlowNftMetadataArgs {
  accountAddress?: string
  tokenId?: string | number
  publicPathIdentifier?: string
  query?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
  flowClient?: FlowClientCore
}

const getNftCadence = (network: "testnet" | "mainnet" | "local") => `
  import NonFungibleToken from ${CONTRACT_ADDRESSES[network].NonFungibleToken}
  import MetadataViews from ${CONTRACT_ADDRESSES[network].MetadataViews}
  import ViewResolver from ${CONTRACT_ADDRESSES[network].ViewResolver}

  access(all) struct ViewInfo {
    access(all) let name: String
    access(all) let description: String
    access(all) let thumbnail: {MetadataViews.File}
    access(all) let rarity: String?
    access(all) let transferrable: Bool
    access(all) let collectionDisplay: MetadataViews.NFTCollectionDisplay?
    access(all) let externalURL: String?
    access(all) let traits: {String: String}?
    access(all) let royalties: {String: UFix64}?
    access(all) let serialNumber: UInt64?

    init(name: String, description: String, thumbnail: {MetadataViews.File}, rarity: String?, transferrable: Bool, collectionDisplay: MetadataViews.NFTCollectionDisplay?, externalURL: String?, traits: {String: String}?, royalties: {String: UFix64}?, serialNumber: UInt64?) {
      self.name = name
      self.description = description
      self.thumbnail = thumbnail
      self.rarity = rarity
      self.transferrable = transferrable
      self.collectionDisplay = collectionDisplay
      self.externalURL = externalURL
      self.traits = traits
      self.royalties = royalties
      self.serialNumber = serialNumber
    }
  }

  access(all) fun main(address: Address, publicPathID: String, tokenID: UInt64): ViewInfo? {
    let account = getAccount(address)

    let capability = account.capabilities.get<&{ViewResolver.ResolverCollection}>(PublicPath(identifier: publicPathID)!)
    if capability != nil {
      let collection = capability!.borrow()
      if collection != nil {
        let resolver = collection!.borrowViewResolver(id: tokenID)
        if resolver != nil {
          // Get display information
          let display = MetadataViews.getDisplay(resolver!)
          if display != nil {
            // Get rarity information
            var rarityDesc: String? = nil
            let rarityView = MetadataViews.getRarity(resolver!)
            if rarityView != nil {
              rarityDesc = rarityView!.description
            }

            // Get collection display information
            var collectionDisplay: MetadataViews.NFTCollectionDisplay? = nil
            let cDisplay = MetadataViews.getNFTCollectionDisplay(resolver!)
            if cDisplay != nil {
              collectionDisplay = cDisplay
            }

            // Get external URL
            var externalURL: String? = nil
            let externalView = MetadataViews.getExternalURL(resolver!)
            if externalView != nil {
              externalURL = externalView!.url
            }

            // Get traits
            var traits: {String: String}? = nil
            let traitsView = MetadataViews.getTraits(resolver!)
            if traitsView != nil {
              var traitsDict: {String: String} = {}
              for trait in traitsView!.traits {
                // Convert trait value to string
                var valueStr: String = ""
                if let s = trait.value as? String { valueStr = s }
                else if let i = trait.value as? Int { valueStr = i.toString() }
                else if let f = trait.value as? UFix64 { valueStr = f.toString() }
                else { valueStr = "Unknown" }
                traitsDict[trait.name] = valueStr
              }
              traits = traitsDict
            }

            // Get royalties
            var royalties: {String: UFix64}? = nil

            // Get serial number
            var serialNumber: UInt64? = nil
            let serialView = MetadataViews.getSerial(resolver!)
            if serialView != nil {
              serialNumber = serialView!.number
            }

            return ViewInfo(
              name: display!.name,
              description: display!.description,
              thumbnail: display!.thumbnail,
              rarity: rarityDesc,
              transferrable: true,
              collectionDisplay: collectionDisplay,
              externalURL: externalURL,
              traits: traits,
              royalties: royalties,
              serialNumber: serialNumber
            )
          }
        }
      }
    }

    // If ViewResolver approach fails, try as a basic NFT collection
    let basicCapability = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(PublicPath(identifier: publicPathID)!)
    if basicCapability != nil {
      let collection = basicCapability!.borrow()
      if collection != nil {
        // Check if the NFT exists
        if collection!.getIDs().contains(tokenID) {
          // Return basic NFT info
          return ViewInfo(
            name: "NFT #".concat(tokenID.toString()),
            description: "An NFT from ".concat(publicPathID),
            thumbnail: MetadataViews.HTTPFile(url: ""),
            rarity: nil,
            transferrable: true,
            collectionDisplay: nil,
            externalURL: nil,
            traits: nil,
            royalties: nil,
            serialNumber: tokenID
          )
        }
      }
    }

    return nil
  }
`

/**
 * Query a single NFT's basic metadata views from an account's ResolverCollection capability.
 */
export function useFlowNftMetadata(params: UseFlowNftMetadataArgs) {
  const chainIdResult = useFlowChainId()

  const queryResult = useFlowQuery({
    cadence: chainIdResult.data
      ? getNftCadence(chainIdResult.data as "testnet" | "mainnet" | "local")
      : "",
    args: (arg, t) => [
      arg(params.accountAddress || "", t.Address),
      arg(params.publicPathIdentifier || "", t.String),
      arg(String(params.tokenId || ""), t.UInt64),
    ],
    flowClient: params.flowClient,
    ...params.query,
  })

  if (chainIdResult.isError) {
    return chainIdResult
  }

  const getThumbnailUrl = (thumbnail: any): string => {
    if (!thumbnail) return ""
    if (thumbnail.url) return thumbnail.url
    if (thumbnail.cid)
      return `https://ipfs.io/ipfs/${thumbnail.cid}${thumbnail.path || ""}`
    return ""
  }

  let processedData: NftViewResult | null = null

  if (queryResult.data) {
    const data = queryResult.data as any
    const collectionDisplay = data.collectionDisplay

    processedData = {
      name: data.name || "Unknown NFT",
      description: data.description || "",
      thumbnailUrl: getThumbnailUrl(data.thumbnail),
      externalUrl: data.externalURL || collectionDisplay?.externalURL?.url,
      collectionName: collectionDisplay?.name,
      collectionExternalUrl: collectionDisplay?.externalURL?.url,
      tokenID: String(params.tokenId ?? ""),
      traits: data.traits || {},
      rarity: data.rarity,
      serialNumber: data.serialNumber ? String(data.serialNumber) : undefined,
    }
  }

  return {
    ...queryResult,
    data: processedData,
  } as UseQueryResult<NftViewResult | null, Error>
}
