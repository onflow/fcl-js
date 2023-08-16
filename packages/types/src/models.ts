export type JsonCdcType<L, T> = T extends undefined
  ? {type: L}
  : {
      type: L
      value: T
    }

export type JsonCdcIdentity = JsonCdcType<"Identity", unknown>
export type JsonCdcUInt = JsonCdcType<"UInt", string>
export type JsonCdcInt = JsonCdcType<"Int", string>
export type JsonCdcUInt8 = JsonCdcType<"UInt8", string>
export type JsonCdcInt8 = JsonCdcType<"Int8", string>
export type JsonCdcUInt16 = JsonCdcType<"UInt16", string>
export type JsonCdcInt16 = JsonCdcType<"Int16", string>
export type JsonCdcUInt32 = JsonCdcType<"UInt32", string>
export type JsonCdcInt32 = JsonCdcType<"Int32", string>
export type JsonCdcUInt64 = JsonCdcType<"UInt64", string>
export type JsonCdcInt64 = JsonCdcType<"Int64", string>
export type JsonCdcUInt128 = JsonCdcType<"UInt128", string>
export type JsonCdcInt128 = JsonCdcType<"Int128", string>
export type JsonCdcUInt256 = JsonCdcType<"UInt256", string>
export type JsonCdcInt256 = JsonCdcType<"Int256", string>
export type JsonCdcWord8 = JsonCdcType<"Word8", string>
export type JsonCdcWord16 = JsonCdcType<"Word16", string>
export type JsonCdcWord32 = JsonCdcType<"Word32", string>
export type JsonCdcWord64 = JsonCdcType<"Word64", string>
export type JsonCdcUFix64 = JsonCdcType<"UFix64", string>
export type JsonCdcFix64 = JsonCdcType<"Fix64", string>
export type JsonCdcString = JsonCdcType<"String", string>
export type JsonCdcCharacter = JsonCdcType<"Character", string>
export type JsonCdcBool = JsonCdcType<"Bool", boolean>
export type JsonCdcAddress = JsonCdcType<"Address", string>
export type JsonCdcVoid = JsonCdcType<"Void", undefined>
export type JsonCdcOptional<T> = JsonCdcType<"Optional", T | null>
export type JsonCdcReference<T extends object> = JsonCdcType<"Reference", T>
export type JsonCdcArray = JsonCdcType<
  "Array",
  JsonCdcTypeMap[keyof JsonCdcTypeMap][]
>
export type JsonCdcDictionary<K, V> = JsonCdcType<"Dictionary", [K, V][]>
export type JsonCdcEvent<T> = JsonCdcType<"Event", T>
export type JsonCdcResource<T> = JsonCdcType<"Resource", T>
export type JsonCdcStruct<T> = JsonCdcType<"Struct", T>
export type JsonCdcEnum<T> = JsonCdcType<"Enum", T>
export type JsonCdcPath = JsonCdcType<"Path", PathType>

export type JsonCdcTypeMap = {
  Identity: JsonCdcIdentity
  UInt: JsonCdcUInt
  Int: JsonCdcInt
  UInt8: JsonCdcUInt8
  Int8: JsonCdcInt8
  UInt16: JsonCdcUInt16
  Int16: JsonCdcInt16
  UInt32: JsonCdcUInt32
  Int32: JsonCdcInt32
  UInt64: JsonCdcUInt64
  Int64: JsonCdcInt64
  UInt128: JsonCdcUInt128
  Int128: JsonCdcInt128
  UInt256: JsonCdcUInt256
  Int256: JsonCdcInt256
  Word8: JsonCdcWord8
  Word16: JsonCdcWord16
  Word32: JsonCdcWord32
  Word64: JsonCdcWord64
  UFix64: JsonCdcUFix64
  Fix64: JsonCdcFix64
  String: JsonCdcString
  Character: JsonCdcCharacter
  Bool: JsonCdcBool
  Address: JsonCdcAddress
  Void: JsonCdcVoid
  Optional: JsonCdcOptional<unknown> // Note: Replace 'any' with the appropriate type
  Reference: JsonCdcReference<object> // Note: Replace 'any' with the appropriate type
  Array: JsonCdcArray // Note: Replace 'any' with the appropriate type
  Dictionary: JsonCdcDictionary<unknown, unknown> // Note: Replace 'any' with the appropriate types
  Event: JsonCdcEvent<unknown> // Note: Replace 'any' with the appropriate type
  Resource: JsonCdcResource<unknown> // Note: Replace 'any' with the appropriate type
  Struct: JsonCdcStruct<unknown> // Note: Replace 'any' with the appropriate type
  Enum: JsonCdcEnum<unknown> // Note: Replace 'any' with the appropriate type
  Path: JsonCdcPath
}

export interface PathType {
  domain: "storage" | "private" | "public"
  identifier: string
}

const _type = <A, L extends keyof JsonCdcTypeMap>(
  label: L,
  asArgument: (x: A) => JsonCdcTypeMap[L],
  asInjection: (x: A) => A
) => ({
  label,
  asArgument,
  asInjection,
})

export interface TypeDescriptor<A, L extends keyof JsonCdcTypeMap> {
  label: string
  asArgument: (x: A) => JsonCdcTypeMap[L]
  asInjection: (x: A) => A
}

// TODO: complete
export interface CompositeType {}
