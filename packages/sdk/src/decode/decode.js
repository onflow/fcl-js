import {log, LEVELS} from "@onflow/util-logger"

const latestBlockDeprecationNotice = () => {
  log.deprecate({
    pkg: "@onflow/decode",
    subject:
      "Operating upon data of the latestBlock field of the response object",
    transition:
      "https://github.com/onflow/flow-js-sdk/blob/master/packages/decode/WARNINGS.md#0001-Deprecating-latestBlock-field",
  })
}

const decodeNumber = async (num, _, stack) => {
  try {
    return Number(num)
  } catch (e) {
    throw new Error(`Decode Number Error : ${stack.join(".")}`)
  }
}

const decodeImplicit = async i => i

const decodeVoid = async () => null

const decodeType = async type => {
  return type.staticType
}

const decodePath = async path => {
  return {
    domain: path.domain,
    identifier: path.identifier,
  }
}

const decodeCapability = async cap => {
  return {
    path: cap.path,
    address: cap.address,
    borrowType: cap.borrowType,
  }
}

const decodeOptional = async (optional, decoders, stack) =>
  optional ? await recurseDecode(optional, decoders, stack) : null

const decodeReference = async v => ({address: v.address, type: v.type})

const decodeArray = async (array, decoders, stack) =>
  await Promise.all(
    array.map(
      v =>
        new Promise(async res =>
          res(await recurseDecode(v, decoders, [...stack, v.type]))
        )
    )
  )

const decodeDictionary = async (dictionary, decoders, stack) =>
  await dictionary.reduce(async (acc, v) => {
    acc = await acc
    acc[await recurseDecode(v.key, decoders, [...stack, v.key])] =
      await recurseDecode(v.value, decoders, [...stack, v.key])
    return acc
  }, Promise.resolve({}))

const decodeComposite = async (composite, decoders, stack) => {
  const decoded = await composite.fields.reduce(async (acc, v) => {
    acc = await acc
    acc[v.name] = await recurseDecode(v.value, decoders, [...stack, v.name])
    return acc
  }, Promise.resolve({}))
  const decoder = composite.id && decoderLookup(decoders, composite.id)
  return decoder ? await decoder(decoded) : decoded
}

const defaultDecoders = {
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
  UFix64: decodeImplicit,
  Fix64: decodeImplicit,
  String: decodeImplicit,
  Character: decodeImplicit,
  Bool: decodeImplicit,
  Address: decodeImplicit,
  Void: decodeVoid,
  Optional: decodeOptional,
  Reference: decodeReference,
  Array: decodeArray,
  Dictionary: decodeDictionary,
  Event: decodeComposite,
  Resource: decodeComposite,
  Struct: decodeComposite,
  Enum: decodeComposite,
  Type: decodeType,
  Path: decodePath,
  Capability: decodeCapability,
}

const decoderLookup = (decoders, lookup) => {
  const found = Object.keys(decoders).find(decoder => {
    if (/^\/.*\/$/.test(decoder)) {
      const reg = new RegExp(decoder.substring(1, decoder.length - 1))
      return reg.test(lookup)
    }
    return decoder === lookup
  })
  return lookup && found && decoders[found]
}

const recurseDecode = async (decodeInstructions, decoders, stack) => {
  let decoder = decoderLookup(decoders, decodeInstructions.type)
  if (!decoder)
    throw new Error(
      `Undefined Decoder Error: ${decodeInstructions.type}@${stack.join(".")}`
    )
  return await decoder(decodeInstructions.value, decoders, stack)
}

export const decode = async (
  decodeInstructions,
  customDecoders = {},
  stack = []
) => {
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

export const decodeResponse = async (response, customDecoders = {}) => {
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
  } else if (response.account) {
    return response.account
  } else if (response.block) {
    return response.block
  } else if (response.blockHeader) {
    return response.blockHeader
  } else if (response.latestBlock) {
    latestBlockDeprecationNotice()
    return response.latestBlock
  } else if (response.transactionId) {
    return response.transactionId
  } else if (response.collection) {
    return response.collection
  }

  return null
}
