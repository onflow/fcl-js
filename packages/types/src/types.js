const type = (label, asParam, asInjection) => ({
  label,
  asParam,
  asInjection,
})

const isArray = (d) => Array.isArray(d)
const isObj = (d) => typeof d === "object"
const isNull = (d) => d == null
const isNumber = (d) => d === "number"
const isInteger = (d) => Number.isInteger(d)
const isFn = (d) => typeof d === "function"

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
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const Int8 = type(
  "Int8",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**7 - 1) >= v) && (v >= ((-2)**7))) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const UInt16 = type(
  "UInt16",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**16 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const Int16 = type(
  "Int16",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**15 - 1) >= v) && (v >= ((-2)**15))) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const UInt32 = type(
  "UInt32",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**32 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const Int32 = type(
  "Int32",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**31 - 1) >= v) && (v >= ((-2)**31))) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const UInt64 = type(
  "UInt64",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**63 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const Int64 = type(
  "Int64",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**63 - 1) >= v) && (v >= ((-2)**64))) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const UInt128 = type(
  "UInt128",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**128 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const Int128 = type(
  "Int128",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**127 - 1) >= v) && (v >= ((-2)**127))) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const UInt256 = type(
  "UInt256",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**256 - 1) >= v) && (v >= 0)) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const Int256 = type(
  "Int256",
  v => {
    if (isNumber(v) && isInteger(v) && ((2**255 - 1) >= v) && (v >= ((-2)**255))) return v 
    throwTypeError("Expected positive integer")
  },
  v => v
)

export const Word8 = type(
  "Word8",
  v => v,
  v => v
)

export const Word16 = type(
  "Word16",
  v => v,
  v => v
)

export const Word32 = type(
  "Word32",
  v => v,
  v => v
)

export const Word64 = type(
  "Word64",
  v => v,
  v => v
)

export const UFix64 = type(
  "UFix64",
  v => v,
  v => v
)

export const Fix64 = type(
  "Fix64",
  v => v,
  v => v
)

export const String = type(
  "String",
  v => v,
  v => v
)

export const Character = type(
  "Character",
  v => v,
  v => v
)

export const Bool = type(
  "Bool",
  v => v,
  v => v
)

export const Address = type(
  "Address",
  v => v,
  v => v
)

export const Void = type(
  "Void",
  v => v,
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
  v => v,
  v => v
)

export const Dictionary = type(
  "Dictionary",
  v => v,
  v => v
)

export const Event = type(
  "Event",
  v => v,
  v => v
)

export const Resource = type(
  "Resource",
  v => v,
  v => v
)

export const Struct = type(
  "Struct",
  v => v,
  v => v
)
