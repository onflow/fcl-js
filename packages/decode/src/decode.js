import {bytes, bytesToString} from "@onflow/bytes"

export const decodeNumber = async (num, _, stack) => {
  try {
    return Number(num)
  } catch (e) {
    throw new Error(`Decode Number Error : ${stack.join(".")}`)
  }
}

export const decodeImplicit = async (i) => i

export const decodeVoid = async () => null

export const decodeOptional = async (optional, decoders, stack) =>
  optional ? await recurseDecode(optional, decoders, stack) : null

export const decodeReference = async (v) => ({address: v.address, type: v.type})

export const decodeArray = async (array, decoders, stack) =>
  await Promise.all(
    array.map(
      (v) =>
        new Promise(async (res) =>
          res(await recurseDecode(v, decoders, [...stack, v.type]))
        )
    )
  )

export const decodeDictionary = async (dictionary, decoders, stack) =>
  await dictionary.reduce(async (acc, v) => {
    acc = await acc
    acc[
      await recurseDecode(v.key, decoders, [...stack, v.key])
    ] = await recurseDecode(v.value, decoders, [...stack, v.key])
    return acc
  }, Promise.resolve({}))

export const decodeComposite = async (composite, decoders, stack) => {
  const decoded = await composite.fields.reduce(async (acc, v) => {
    acc = await acc
    acc[v.name] = await recurseDecode(v.value, decoders, [...stack, v.name])
    return acc
  }, Promise.resolve({}))
  const decoder = composite.id && decoderLookup(decoders, composite.id)
  return decoder ? await decoder(decoded) : decoded
}

export const defaultDecoders = {
  UInt: decodeNumber,
  Int: decodeNumber,
  UInt8: decodeNumber,
  Int8: decodeNumber,
  UInt16: decodeNumber,
  Int16: decodeNumber,
  UInt32: decodeNumber,
  Int32: decodeNumber,
  UInt64: decodeNumber,
  Int64: decodeNumber,
  UInt128: decodeNumber,
  Int128: decodeNumber,
  UInt256: decodeNumber,
  Int256: decodeNumber,
  Word8: decodeNumber,
  Word16: decodeNumber,
  Word32: decodeNumber,
  Word64: decodeNumber,
  UFix64: decodeNumber,
  Fix64: decodeNumber,
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
}

export const decoderLookup = (decoders, lookup) => {
  const found = Object.keys(decoders).find(decoder => {
    if (/^\/.*\/$/.test(decoder)) {
      const reg = new RegExp(decoder.substring(1, decoder.length - 1))
      return reg.test(lookup)  
    }
    return decoder === lookup
  })
  return lookup && found && decoders[found]
}

export const recurseDecode = async (decodeInstructions, decoders, stack) => {
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
  let decoders = {...defaultDecoders, ...customDecoders}
  return await recurseDecode(decodeInstructions, decoders, stack)
}

export const decodeResponse = async (response, customDecoders = {}) => {
  let decoders = {...defaultDecoders, ...customDecoders}

  const encoded = response.encodedData
  const decodeInstructions = bytesToString(bytes(encoded))
  const decodeInstructionsJson = JSON.parse(decodeInstructions)

  return await decode(decodeInstructionsJson, decoders)
}
