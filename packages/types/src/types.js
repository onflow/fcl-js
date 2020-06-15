const type = (label, asParam, asInjection) => ({
  label,
  asParam,
  asInjection,
})

const isArray = (d) => Array.isArray(d)
const isObj = (d) => typeof d === "object"
const isNull = (d) => d == null
const isBoolean = (d) => typeof d === "boolean"
const isNumber = (d) => typeof d === "number"
const isInteger = (d) => Number.isInteger(d)
const isString = (d) => typeof d === "string"
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
    if (isNumber(v) && isInteger(v)) return {
      type: "UInt",
      value: v
    }
    throwTypeError("Expected Positive Integer for type Unsigned Int")
  },
  v => v
)

export const Int = type(
  "Int",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Int",
      value: v 
    }
    throwTypeError("Expected Integer for type Int")
  },
  v => v
)

export const UInt8 = type(
  "UInt8",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "UInt8",
      value: v 
    }
    throwTypeError("Expected integer for UInt8")
  },
  v => v
)

export const Int8 = type(
  "Int8",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Int8",
      value: v 
    } 
    throwTypeError("Expected positive integer for Int8")
  },
  v => v
)

export const UInt16 = type(
  "UInt16",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "UInt16",
      value: v,
    }
    throwTypeError("Expected integer for UInt16")
  },
  v => v
)

export const Int16 = type(
  "Int16",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Int16",
      value: v 
    } 
    throwTypeError("Expected positive integer for Int16")
  },
  v => v
)

export const UInt32 = type(
  "UInt32",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "UInt32",
      value: v 
    } 
    throwTypeError("Expected integer for UInt32")
  },
  v => v
)

export const Int32 = type(
  "Int32",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Int32",
      value: v 
    }
    throwTypeError("Expected positive integer for Int32")
  },
  v => v
)

export const UInt64 = type(
  "UInt64",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "UInt64",
      value: v 
    } 
    throwTypeError("Expected integer for UInt64")
  },
  v => v
)

export const Int64 = type(
  "Int64",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Int64",
      value: v 
    }
    throwTypeError("Expected positive integer for Int64")
  },
  v => v
)

export const UInt128 = type(
  "UInt128",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "UInt128",
      value: v 
    }
    throwTypeError("Expected integer for UInt128")
  },
  v => v
)

export const Int128 = type(
  "Int128",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Int128",
      value: v 
    } 
    throwTypeError("Expected positive integer for Int128")
  },
  v => v
)

export const UInt256 = type(
  "UInt256",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "UInt256",
      value: v 
    }
    throwTypeError("Expected integer for UInt256")
  },
  v => v
)

export const Int256 = type(
  "Int256",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Int256",
      value: v 
    } 
    throwTypeError("Expected integer for Int256")
  },
  v => v
)

export const Word8 = type(
  "Word8",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Word8",
      value: v 
    } 
    throwTypeError("Expected positive number for Word8")
  },
  v => v
)

export const Word16 = type(
  "Word16",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Word16",
      value: v 
    } 
    throwTypeError("Expected positive number for Word16")
  },
  v => v
)

export const Word32 = type(
  "Word32",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Word32",
      value: v 
    } 
    throwTypeError("Expected positive number for Word32")
  },
  v => v
)

export const Word64 = type(
  "Word64",
  v => {
    if (isNumber(v) && isInteger(v)) return {
      type: "Word64",
      value: v 
    } 
    throwTypeError("Expected positive number for Word64")
  },
  v => v
)

export const UFix64 = type(
  "UFix64",
  v => {
    if (isNumber(v)) return {
      type: "UFix64",
      value: v 
    } 
    throwTypeError("Expected positive integer for UFix64")
  },
  v => v
)

export const Fix64 = type(
  "Fix64",
  v => {
    if (isNumber(v)) return {
      type: "Fix64",
      value: v 
    } 
    throwTypeError("Expected integer for Fix64")
  },
  v => v
)

export const String = type(
  "String",
  v => {
    if (isString(v)) return {
      type: "String",
      value: v 
    }
    throwTypeError("Expected String for type String")
  },
  v => v
)

export const Character = type(
  "Character",
  v => {
    if (isString(v)) return {
      type: "Character",
      value: v 
    }
    throwTypeError("Expected Character for type Character")
  },
  v => v
)

export const Bool = type(
  "Bool",
  v => {
    if (isBoolean(v)) return {
      type: "Bool",
      value: v 
    }
    throwTypeError("Expected Boolean for type Bool")
  },
  v => v
)

export const Address = type(
  "Address",
  v => {
    if (isString(v)) return {
      type: "Address",
      value: v 
    }
    throwTypeError("Expected Address for type Address")
  },
  v => v
)

export const Void = type(
  "Void",
  v => {
    if (!v || isNull(v)) return {
      type: "Void"
    }
    throwTypeError("Expected Void for type Void")
  },
  v => v
)

export const Optional = type(
  "Optional",
  v => ({
    type: "Optional",
    value: v
  }),
  v => v
)

export const Reference = type(
  "Reference",
  v => {
    if (isObj(v)) return {
      type: "Reference",
      value: v
    }
    throwTypeError("Expected Object for type Reference")
  },
  v => v
)

export const _Array = type(
  "Array",
  v => {
    return {
      type: "Array",
      value: isArray(v) ? v : [v]
    }
  },
  v => v
)

export {_Array as Array}

export const Dictionary = type(
  "Dictionary",
  v => {
    if (isObj(v)) return {
      type: "Dictionary",
      value: isArray(v) ? v : [v]
    }
    throwTypeError("Expected Object for type Dictionary")
  },
  v => v
)

export const Event = type(
  "Event",
  v => {
    if (isObj(v)) return {
      type: "Event",
      value: v
    }
    throwTypeError("Expected Object for type Event")
  },
  v => v
)

export const Resource = type(
  "Resource",
  v => {
    if (isObj(v)) return {
      type: "Resource",
      value: v
    }
    throwTypeError("Expected Object for type Resource")
  },
  v => v
)

export const Struct = type(
  "Struct",
  v => {
    if (isObj(v)) return {
      type: "Struct",
      value: v
    }
    throwTypeError("Expected Object for type Struct")
  },
  v => v
)
