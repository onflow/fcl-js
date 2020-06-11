const type = (label, asParam, asInjection) => ({
  label,
  asParam,
  asInjection,
})

const isArray = (d) => Array.isArray(d)
const isObj = (d) => typeof d === "object"
const isNull = (d) => d == null
const isBoolean = (d) => typeof d === "boolean"
const isNumber = (d) => d === "number"
const isInteger = (d) => Number.isInteger(d)
const isString = (d) => typeof d === "string"

const throwTypeError = (msg) => {
  throw new Error("Type Error: " + msg)
} 

export const Identity = type(
  "Identity",
  v => v,
  v => v
)

export const UInt = type(
  "UInt",
  v => {
    if (isNumber(v) && isInteger(v) && v >= 0) return v 
    throwTypeError("Expected Positive Integer for type Unsigned Int")
  },
  v => v
)

export const Int = type(
  "Int",
  v => {
    if (isNumber(v) && isInteger(v)) return v 
    throwTypeError("Expected Integer for type Int")
  },
  v => v
)

export const UInt8 = type(
  "UInt8",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**8 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected integer for UInt8")
  },
  v => v
)

export const Int8 = type(
  "Int8",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**7 - 1) >= v) && (v >= ((-2)**7))) return v 
    throwTypeError("Expected positive integer for Int8")
  },
  v => v
)

export const UInt16 = type(
  "UInt16",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**16 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected integer for UInt16")
  },
  v => v
)

export const Int16 = type(
  "Int16",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**15 - 1) >= v) && (v >= ((-2)**15))) return v 
    throwTypeError("Expected positive integer for Int16")
  },
  v => v
)

export const UInt32 = type(
  "UInt32",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**32 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected integer for UInt32")
  },
  v => v
)

export const Int32 = type(
  "Int32",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**31 - 1) >= v) && (v >= ((-2)**31))) return v 
    throwTypeError("Expected positive integer for Int32")
  },
  v => v
)

export const UInt64 = type(
  "UInt64",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**63 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected integer for UInt64")
  },
  v => v
)

export const Int64 = type(
  "Int64",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**63 - 1) >= v) && (v >= ((-2)**64))) return v 
    throwTypeError("Expected positive integer for Int64")
  },
  v => v
)

export const UInt128 = type(
  "UInt128",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**128 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected integer for UInt128")
  },
  v => v
)

export const Int128 = type(
  "Int128",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**127 - 1) >= v) && (v >= ((-2)**127))) return v 
    throwTypeError("Expected positive integer for Int128")
  },
  v => v
)

export const UInt256 = type(
  "UInt256",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**256 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected integer for UInt256")
  },
  v => v
)

export const Int256 = type(
  "Int256",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**255 - 1) >= v) && (v >= ((-2)**255))) return v 
    throwTypeError("Expected integer for Int256")
  },
  v => v
)

export const Word8 = type(
  "Word8",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**8 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive number for Word8")
  },
  v => v
)

export const Word16 = type(
  "Word16",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**16 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive number for Word16")
  },
  v => v
)

export const Word32 = type(
  "Word32",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**32 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive number for Word32")
  },
  v => v
)

export const Word64 = type(
  "Word64",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**64 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive number for Word64")
  },
  v => v
)

export const UFix64 = type(
  "UFix64",
  v => {
    if (isNumber(v) && ((2**63 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive integer for UFix64")
  },
  v => v
)

export const Fix64 = type(
  "Fix64",
  v => {
    if (isNumber(v) && ((2**63 - 1) >= v) && (v >= ((-2)**64))) return v 
    throwTypeError("Expected integer for Fix64")
  },
  v => v
)

export const String = type(
  "String",
  v => {
    if (isString(v)) return v
    throwTypeError("Expected String for type String")
  },
  v => v
)

export const Character = type(
  "Character",
  v => {
    if (isString(v) && v.length === 1) return v
    throwTypeError("Expected Character for type Character")
  },
  v => v
)

export const Bool = type(
  "Bool",
  v => {
    if (isBoolean(v)) return v
    throwTypeError("Expected Boolean for type Bool")
  },
  v => v
)

export const Address = type(
  "Address",
  v => {
    if (isString(v)) return v
    throwTypeError("Expected Address for type Address")
  },
  v => v
)

export const Void = type(
  "Void",
  v => {
    if (!v || isNull(v)) return v
    throwTypeError("Expected Void for type Void")
  },
  v => v
)

export const Optional = type(
  "Optional",
  v => v,
  v => v
)

export const Reference = type(
  "Reference",
  v => v,
  v => v
)

export const Array = type(
  "Array",
  v => {
    if (isArray(v)) return v
    throwTypeError("Expected Array for type Array")
  },
  v => v
)

export const Dictionary = type(
  "Dictionary",
  v => {
    if (isObj(v)) return v
    throwTypeError("Expected Object for type Dictionary")
  },
  v => v
)

export const Event = type(
  "Event",
  v => v,
  v => v
)

export const Resource = type(
  "Resource",
  v => {
    if (isObj(v)) return v
    throwTypeError("Expected Object for type Dictionary")
  },
  v => v
)

export const Struct = type(
  "Struct",
  v => {
    if (isObj(v)) return v
    throwTypeError("Expected Object for type Dictionary")
  },
  v => v
)
