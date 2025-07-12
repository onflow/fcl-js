import {invariant} from "@onflow/util-invariant"
import fetchTransport from "cross-fetch"
import {config} from "@onflow/config"

interface DocumentResolverParams {
  url: string
}

export interface RetrieveParams {
  url: string
}

async function httpDocumentResolver({
  url,
}: DocumentResolverParams): Promise<any> {
  invariant(
    typeof url !== "undefined",
    "retrieve({ url }) -- url must be defined"
  )

  let res: Response
  try {
    res = await fetchTransport(url)
  } catch (e) {
    throw new Error("httpDocumentResolver Error: Failed to retrieve document.")
  }

  let document = res.ok ? await res.json() : null

  return document
}

const DOCUMENT_RESOLVERS: Map<string, typeof httpDocumentResolver> = new Map([
  ["http", httpDocumentResolver],
  ["https", httpDocumentResolver],
])

/**
 * @description Retrieves a document from a URL using protocol-specific resolvers. This function
 * supports HTTP/HTTPS by default and can be extended with custom resolvers through FCL configuration.
 * It's used internally by FCL to fetch interaction templates and other external documents.
 *
 * @param params The retrieval parameters
 * @param params.url The URL of the document to retrieve
 * @returns Promise that resolves to the retrieved document (typically a JSON object)
 * @throws {Error} If URL is invalid, protocol is unsupported, or retrieval fails
 *
 * @example
 * // Retrieve an interaction template
 * const template = await retrieve({
 *   url: "https://flix.flow.com/v1.0/templates/transfer-flow-tokens"
 * })
 * console.log("Template:", template)
 */
export async function retrieve({url}: RetrieveParams): Promise<any> {
  invariant(
    typeof url !== "undefined",
    "retrieve({ url }) -- url must be defined"
  )
  invariant(
    typeof url === "string",
    "retrieve({ url }) -- url must be a string"
  )

  const documentResolversFromConfig = await config().where(
    /^document\.resolver\./
  )
  Object.keys(documentResolversFromConfig).map(key => {
    const resolverFromConfig = documentResolversFromConfig[key]
    const resolverProtocol = key.replace(/^document\.resolver\./, "")
    DOCUMENT_RESOLVERS.set(
      resolverProtocol,
      resolverFromConfig as typeof httpDocumentResolver
    )
  })

  const urlParts: any = /^(.*):\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$/.exec(url)
  invariant(urlParts, "Failed to parse URL")
  const protocol = urlParts[1]
  invariant(urlParts, "Failed to parse URL protocol")

  const resolver: any = DOCUMENT_RESOLVERS.get(protocol)
  invariant(resolver, `No resolver found for protcol=${protocol}`)

  let document = await resolver({url})

  return document
}
