export type JsonCdc<L extends string, T> = {
    type: L;
    value: T;
};
type JsonCdcLabel<X extends JsonCdc<string, unknown>> = X extends JsonCdc<infer L, unknown> ? L : never;
export interface TypeDescriptor<T, V extends JsonCdc<string, unknown>> {
    label: JsonCdcLabel<V>;
    asArgument: (x: T) => V;
    asInjection: (x: T) => T;
}
type TypeDescriptorInput<X extends TypeDescriptor<any, JsonCdc<string, unknown>>> = X extends TypeDescriptor<infer T, JsonCdc<string, unknown>> ? T : never;
export interface PathValue {
    domain: "storage" | "private" | "public";
    identifier: string;
}
export interface ReferenceValue {
    type: string;
    address: string;
}
/**
 * @deprecated will be removed in v2.0.0
 */
export declare const Identity: {
    label: string;
    asArgument: <T>(v: T) => T;
    asInjection: <T_1>(v: T_1) => T_1;
};
export declare const UInt: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Int: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const UInt8: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Int8: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const UInt16: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Int16: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const UInt32: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Int32: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const UInt64: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Int64: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const UInt128: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Int128: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const UInt256: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Int256: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Word8: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Word16: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Word32: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Word64: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const UFix64: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const Fix64: TypeDescriptor<string | number, {
    type: string;
    value: string;
}>;
export declare const String: TypeDescriptor<string, {
    type: string;
    value: string;
}>;
export declare const Character: TypeDescriptor<string, {
    type: string;
    value: string;
}>;
export declare const Bool: TypeDescriptor<boolean, {
    type: string;
    value: boolean;
}>;
export declare const Address: TypeDescriptor<string, {
    type: string;
    value: string;
}>;
export declare const Void: TypeDescriptor<null | undefined, {
    type: string;
    value: null;
}>;
export declare const Optional: <T extends TypeDescriptor<any, JsonCdc<string, unknown>>>(children: T) => TypeDescriptor<TypeDescriptorInput<T> | null | undefined, {
    type: string;
    value: JsonCdc<string, unknown> | null;
}>;
export declare const Reference: TypeDescriptor<ReferenceValue, {
    type: string;
    value: ReferenceValue;
}>;
export declare const _Array: <T extends TypeDescriptor<any, JsonCdc<string, unknown>>>(children?: T | T[]) => TypeDescriptor<TypeDescriptorInput<T>[], {
    type: string;
    value: JsonCdc<string, unknown>[];
}>;
export { _Array as Array };
export declare const Dictionary: <K extends TypeDescriptor<any, JsonCdc<string, unknown>>, V extends TypeDescriptor<any, JsonCdc<string, unknown>>>(children?: {
    key: K;
    value: V;
} | {
    key: K;
    value: V;
}[]) => TypeDescriptor<{
    key: TypeDescriptorInput<K>;
    value: TypeDescriptorInput<V>;
}[] | {
    key: TypeDescriptorInput<K>;
    value: TypeDescriptorInput<V>;
}, {
    type: string;
    value: {
        key: JsonCdc<string, unknown>;
        value: JsonCdc<string, unknown>;
    }[];
}>;
export declare const Event: <V extends TypeDescriptor<any, JsonCdc<string, unknown>>>(id: string, fields?: {
    value: V;
} | {
    value: V;
}[]) => TypeDescriptor<{
    fields: {
        name: string;
        value: TypeDescriptorInput<V>;
    }[];
}, {
    type: string;
    value: {
        id: string;
        fields: {
            name: string;
            value: JsonCdc<string, unknown>;
        }[];
    };
}>;
export declare const Resource: <V extends TypeDescriptor<any, JsonCdc<string, unknown>>>(id: string, fields?: {
    value: V;
} | {
    value: V;
}[]) => TypeDescriptor<{
    fields: {
        name: string;
        value: TypeDescriptorInput<V>;
    }[];
}, {
    type: string;
    value: {
        id: string;
        fields: {
            name: string;
            value: JsonCdc<string, unknown>;
        }[];
    };
}>;
export declare const Struct: <V extends TypeDescriptor<any, JsonCdc<string, unknown>>>(id: string, fields?: {
    value: V;
} | {
    value: V;
}[]) => TypeDescriptor<{
    fields: {
        name: string;
        value: TypeDescriptorInput<V>;
    }[];
}, {
    type: string;
    value: {
        id: string;
        fields: {
            name: string;
            value: JsonCdc<string, unknown>;
        }[];
    };
}>;
export declare const Enum: <V extends TypeDescriptor<any, JsonCdc<string, unknown>>>(id: string, fields?: {
    value: V;
} | {
    value: V;
}[]) => TypeDescriptor<{
    fields: {
        name: string;
        value: TypeDescriptorInput<V>;
    }[];
}, {
    type: string;
    value: {
        id: string;
        fields: {
            name: string;
            value: JsonCdc<string, unknown>;
        }[];
    };
}>;
export declare const Path: TypeDescriptor<PathValue, {
    type: string;
    value: {
        domain: "storage" | "private" | "public";
        identifier: string;
    };
}>;
