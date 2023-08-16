export type JsonCdcType<L, T> = T extends undefined
  ? {type: L}
  : {
      type: L
      value: T
    }

type JsonCdcArray = JsonCdcType<"Array", JsonCdc[keyof JsonCdc][]>

export type JsonCdc = {
  Identity: JsonCdcType<"Identity", unknown>
  UInt: JsonCdcType<"UInt", string>
  Int: JsonCdcType<"Int", string>
  UInt8: JsonCdcType<"UInt8", string>
  Int8: JsonCdcType<"Int8", string>
  UInt16: JsonCdcType<"UInt16", string>
  Int16: JsonCdcType<"Int16", string>
  UInt32: JsonCdcType<"UInt32", string>
  Int32: JsonCdcType<"Int32", string>
  UInt64: JsonCdcType<"UInt64", string>
  Int64: JsonCdcType<"Int64", string>
  UInt128: JsonCdcType<"UInt128", string>
  Int128: JsonCdcType<"Int128", string>
  UInt256: JsonCdcType<"UInt256", string>
  Int256: JsonCdcType<"Int256", string>
  Word8: JsonCdcType<"Word8", string>
  Word16: JsonCdcType<"Word16", string>
  Word32: JsonCdcType<"Word32", string>
  Word64: JsonCdcType<"Word64", string>
  UFix64: JsonCdcType<"UFix64", string>
  Fix64: JsonCdcType<"Fix64", string>
  String: JsonCdcType<"String", string>
  Character: JsonCdcType<"Character", string>
  Bool: JsonCdcType<"Bool", boolean>
  Address: JsonCdcType<"Address", string>
  Void: JsonCdcType<"Void", undefined>
  Optional: JsonCdcType<"Optional", unknown> // Note: Replace 'unknown' with the appropriate type
  Reference: JsonCdcType<"Reference", object> // Note: Replace 'object' with the appropriate type
  Array: JsonCdcArray
  Dictionary: JsonCdcType<"Dictionary", [unknown, unknown][]>
  Event: JsonCdcType<"Event", unknown> // Note: Replace 'unknown' with the appropriate type
  Resource: JsonCdcType<"Resource", unknown> // Note: Replace 'unknown' with the appropriate type
  Struct: JsonCdcType<"Struct", unknown> // Note: Replace 'unknown' with the appropriate type
  Enum: JsonCdcType<"Enum", unknown> // Note: Replace 'unknown' with the appropriate type
  Path: JsonCdcType<"Path", PathType>
}

export interface PathType {
  domain: "storage" | "private" | "public"
  identifier: string
}

export interface TypeDescriptor<A, L extends keyof JsonCdc> {
  label: string
  asArgument: (x: A) => JsonCdc[L]
  asInjection: (x: A) => A
}

// TODO: complete
export interface CompositeType {}
