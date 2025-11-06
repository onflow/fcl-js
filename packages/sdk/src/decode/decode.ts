import {log} from "@onflow/util-logger"
import {decodeStream} from "./decode-stream"

type DecoderFunction = (
  value: any,
  decoders: DecoderMap,
  stack: any[]
) => Promise<any>

interface DecoderMap {
  [key: string]: DecoderFunction
}

interface DecodeInstructions {
  type: string
  value?: any
}

interface CompositeField {
  name: string
  value: DecodeInstructions
}

interface CompositeInstruction {
  id?: string
  fields: CompositeField[]
}

interface KeyValuePair {
  key: DecodeInstructions
  value: DecodeInstructions
}

interface InclusiveRangeValue {
  start?: DecodeInstructions
  end?: DecodeInstructions
  step?: DecodeInstructions
  [key: string]: any
}

interface FlowEvent {
  type: string
  transactionId: string
  transactionIndex: number
  eventIndex: number
  payload: DecodeInstructions
}

interface FlowBlockEvent extends FlowEvent {
  blockId: string
  blockHeight: number
  blockTimestamp: string
}

interface FlowTransactionStatus {
  blockId: string
  status: number
  statusCode: number
  errorMessage: string
  events: FlowEvent[]
}

interface FlowResponse {
  encodedData?: DecodeInstructions
  transactionStatus?: FlowTransactionStatus
  transaction?: any
  events?: FlowBlockEvent[]
  account?: any
  block?: any
  blockHeader?: any
  blockDigest?: any
  event?: any
  accountStatusEvent?: any
  latestBlock?: any
  transactionId?: string
  collection?: any
  networkParameters?: {
    chainId: string
  }
  streamConnection?: any
  heartbeat?: any
  nodeVersionInfo?: any
}

const latestBlockDeprecationNotice = (): void => {
  log.deprecate({
    pkg: "@onflow/decode",
    subject:
      "Operating upon data of the latestBlock field of the response object",
    transition:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/decode/WARNINGS.md#0001-Deprecating-latestBlock-field",
  })
}

const decodeNumber = async (
  num: any,
  _: DecoderMap,
  stack: any[]
): Promise<number> => {
  try {
    return Number(num)
  } catch (e) {
    throw new Error(`Decode Number Error : ${stack.join(".")}`)
  }
}

const decodeImplicit = async <T>(i: T): Promise<T> => i

const decodeVoid = async (): Promise<null> => null

const decodeType = async (type: any): Promise<any> => {
  return type.staticType
}

const decodeOptional = async (
  optional: any,
  decoders: DecoderMap,
  stack: any[]
): Promise<any> =>
  optional ? await recurseDecode(optional, decoders, stack) : null

const decodeArray = async (
  array: DecodeInstructions[],
  decoders: DecoderMap,
  stack: any[]
): Promise<any[]> =>
  await Promise.all(
    array.map(
      v =>
        new Promise(async res =>
          res(await recurseDecode(v, decoders, [...stack, v.type]))
        )
    )
  )

const decodeDictionary = async (
  dictionary: KeyValuePair[],
  decoders: DecoderMap,
  stack: any[]
): Promise<Record<string, any>> =>
  await dictionary.reduce(
    async (acc, v) => {
      acc = await acc
      acc[await recurseDecode(v.key, decoders, [...stack, v.key])] =
        await recurseDecode(v.value, decoders, [...stack, v.key])
      return acc
    },
    Promise.resolve({}) as any
  )

const decodeComposite = async (
  composite: CompositeInstruction,
  decoders: DecoderMap,
  stack: any[]
): Promise<any> => {
  const decoded = await composite.fields.reduce(
    async (acc, v) => {
      acc = await acc
      acc[v.name] = await recurseDecode(v.value, decoders, [...stack, v.name])
      return acc
    },
    Promise.resolve({}) as any
  )
  const decoder = composite.id && decoderLookup(decoders, composite.id)
  return decoder ? await decoder(decoded) : decoded
}

const decodeInclusiveRange = async (
  range: InclusiveRangeValue,
  decoders: DecoderMap,
  stack: any[]
): Promise<Record<string, any>> => {
  // Recursive decode for start, end, and step
  // We don't do all fields just in case there are future API changes
  // where fields added and are not Cadence values
  const keys = ["start", "end", "step"]
  const decoded = await Object.keys(range).reduce(
    async (acc, key) => {
      acc = await acc
      if (keys.includes(key)) {
        acc[key] = await recurseDecode(range[key], decoders, [...stack, key])
      }
      return acc
    },
    Promise.resolve({}) as any
  )
  return decoded
}

const defaultDecoders: DecoderMap = {
  UInt: decodeImplicit,
  Int: decodeImplicit,
  UInt8: decodeImplicit,
  Int8: decodeImplicit,
  UInt16: decodeImplicit,
  Int16: decodeImplicit,
  UInt32: decodeImplicit,
  Int32: decodeImplicit,
  UInt64: decodeImplicit,
  Int64: decodeImplicit,
  UInt128: decodeImplicit,
  Int128: decodeImplicit,
  UInt256: decodeImplicit,
  Int256: decodeImplicit,
  Word8: decodeImplicit,
  Word16: decodeImplicit,
  Word32: decodeImplicit,
  Word64: decodeImplicit,
  Word128: decodeImplicit,
  Word256: decodeImplicit,
  UFix64: decodeImplicit,
  Fix64: decodeImplicit,
  UFix128: decodeImplicit,
  Fix128: decodeImplicit,
  String: decodeImplicit,
  Character: decodeImplicit,
  Bool: decodeImplicit,
  Address: decodeImplicit,
  Void: decodeVoid,
  Optional: decodeOptional,
  Reference: decodeImplicit,
  Array: decodeArray,
  Dictionary: decodeDictionary,
  Event: decodeComposite,
  Resource: decodeComposite,
  Struct: decodeComposite,
  Enum: decodeComposite,
  Type: decodeType,
  Path: decodeImplicit,
  Capability: decodeImplicit,
  InclusiveRange: decodeInclusiveRange,
}

const decoderLookup = (decoders: DecoderMap, lookup: any): any => {
  const found = Object.keys(decoders).find(decoder => {
    if (/^\/.*\/$/.test(decoder)) {
      const reg = new RegExp(decoder.substring(1, decoder.length - 1))
      return reg.test(lookup)
    }
    return decoder === lookup
  })
  return lookup && found && decoders[found]
}

const recurseDecode = async (
  decodeInstructions: DecodeInstructions,
  decoders: DecoderMap,
  stack: any[]
): Promise<any> => {
  let decoder = decoderLookup(decoders, decodeInstructions.type)
  if (!decoder)
    throw new Error(
      `Undefined Decoder Error: ${decodeInstructions.type}@${stack.join(".")}`
    )
  return await decoder(decodeInstructions.value, decoders, stack)
}

/**
 * @description - Decodes a response from Flow into JSON
 * @param decodeInstructions - The response object from Flow
 * @param customDecoders - An object of custom decoders
 * @param stack - The stack of the current decoding
 * @returns - The decoded response
 */
export const decode = async (
  decodeInstructions: DecodeInstructions,
  customDecoders: DecoderMap = {},
  stack: any[] = []
): Promise<any> => {
  // Filter out all default decoders which are overridden by a custom decoder regex
  const filteredDecoders = Object.keys(defaultDecoders)
    .filter(
      decoder =>
        !Object.keys(customDecoders).find(customDecoder =>
          new RegExp(customDecoder).test(decoder)
        )
    )
    .reduce((decoders, decoderKey) => {
      decoders[decoderKey] = defaultDecoders[decoderKey]
      return decoders
    }, customDecoders)

  const decoders = {
    ...filteredDecoders,
    ...customDecoders,
  }
  return recurseDecode(decodeInstructions, decoders, stack)
}

/**
 * Decodes a response from Flow into JSON
 *
 * @param response The response object from Flow
 * @param customDecoders An object of custom decoders
 * @returns The decoded response
 */
export const decodeResponse = async (
  response: FlowResponse,
  customDecoders: DecoderMap = {}
): Promise<any> => {
  if (response.encodedData) {
    return decode(response.encodedData, customDecoders)
  } else if (response.transactionStatus) {
    return {
      ...response.transactionStatus,
      events: await Promise.all(
        response.transactionStatus.events.map(async function decodeEvents(e) {
          return {
            type: e.type,
            transactionId: e.transactionId,
            transactionIndex: e.transactionIndex,
            eventIndex: e.eventIndex,
            data: await decode(e.payload, customDecoders),
          }
        })
      ),
    }
  } else if (response.transaction) {
    return response.transaction
  } else if (response.events) {
    return await Promise.all(
      response.events.map(async function decodeEvents(e) {
        return {
          blockId: e.blockId,
          blockHeight: e.blockHeight,
          blockTimestamp: e.blockTimestamp,
          type: e.type,
          transactionId: e.transactionId,
          transactionIndex: e.transactionIndex,
          eventIndex: e.eventIndex,
          data: await decode(e.payload, customDecoders),
        }
      })
    )
  } else if (response.event) {
    const {payload, ...rest} = response.event
    return {
      ...rest,
      data: await decode(payload, customDecoders),
    }
  } else if (response.accountStatusEvent) {
    const {payload, ...rest} = response.accountStatusEvent
    return {
      ...rest,
      data: await decode(payload, customDecoders),
    }
  } else if (response.account) {
    return response.account
  } else if (response.block) {
    return response.block
  } else if (response.blockHeader) {
    return response.blockHeader
  } else if (response.blockDigest) {
    return response.blockDigest
  } else if (response.latestBlock) {
    latestBlockDeprecationNotice()
    return response.latestBlock
  } else if (response.transactionId) {
    return response.transactionId
  } else if (response.collection) {
    return response.collection
  } else if (response.networkParameters) {
    const prefixRegex = /^flow-/
    const rawChainId = response.networkParameters.chainId
    let formattedChainId: string

    if (rawChainId === "flow-emulator") {
      formattedChainId = "local"
    } else if (prefixRegex.test(rawChainId)) {
      formattedChainId = rawChainId.replace(prefixRegex, "")
    } else {
      formattedChainId = rawChainId
    }

    return {
      chainId: formattedChainId,
    }
  } else if (response.streamConnection) {
    return decodeStream(
      response.streamConnection,
      decodeResponse,
      customDecoders
    )
  } else if (response.heartbeat) {
    return response.heartbeat
  } else if (response.nodeVersionInfo) {
    return response.nodeVersionInfo
  }

  return null
}
