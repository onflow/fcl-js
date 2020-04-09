import {bytes, bytesToString} from "@onflow/bytes"

export const decodeNumber = (num, _, stack) => {
  try {
    return Number(num)
  } catch (e) {
    throw new Error(`Decode Number Error : ${stack.join(".")}`)
  }
}

export const decodeImplicit = (i) => i

export const decodeVoid = () => null

export const decodeOptional = (optional, decoders, stack) =>
  optional ? recurseDecode(optional, decoders, stack) : null

export const decodeReference = (v) => ({address: v.address, type: v.type})

export const decodeArray = (array, decoders, stack) =>
  array.map((v) => recurseDecode(v, decoders, [...stack, v.type]))

export const decodeDictionary = (dictionary, decoders, stack) =>
  dictionary.reduce((acc, v) => {
    acc[
      recurseDecode(v.key, decoders, [...stack, v.key])
    ] = recurseDecode(v.value, decoders, [...stack, v.key])
    return acc
  }, {})

export const decodeComposite = (composite, decoders, stack) =>
  composite.fields.reduce((acc, v) => {
    acc[v.name] = recurseDecode(v.value, decoders, [...stack, v.name])
    return acc
  }, {})

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

export const recurseDecode = (decodeInstructions, decoders, stack) => {
  let decoder = decoders[decodeInstructions.type]
  if (!decoder)
    throw new Error(
      `Undefined Decoder Error: ${decodeInstructions.type}@${stack.join(".")}`
    )
  return decoder(decodeInstructions.value, decoders, stack)
}

// TODO: Implement correctly once the JSON encoding is returned from the access API.
export const decode = (decodeInstructions, customDecoders = {}, stack = []) => {
  let decoders = {...defaultDecoders, ...customDecoders}
  return recurseDecode(decodeInstructions, decoders, stack)
}

// TODO: Implement correctly once the JSON encoding is returned form the access API.
export const decodeResponse = (response, customDecoders = {}) => {
  let decoders = {...defaultDecoders, ...customDecoders}

  const encoded = response.encodedData
  const decodeInstructions = bytesToString(bytes(encoded))
  const decodeInstructionsJson = JSON.parse(decodeInstructions)

  return decode(decodeInstructionsJson, decoders)
}
