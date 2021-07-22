import * as root from "./decode.js"
import {decode, decodeResponse} from "./decode.js"

it("exported interface contract", () => {
  expect(root).toStrictEqual(
    expect.objectContaining({
      decode: expect.any(Function),
      decodeResponse: expect.any(Function),
    })
  )
})

it("decodeResponse", async () => {
  const response = {
    encodedData: JSON.parse(Buffer.from(Uint8Array.from(
      Buffer.from(
        "7b2274797065223a22496e74222c2276616c7565223a2237227d0a",
        "hex"
      )
    )).toString("utf8")),
  }

  const data = await decodeResponse(response)
  expect(data).toBe(7)
})

describe("unit tests to cover all types", () => {
  it("returns the correct response given a json-cdc payload 2 OPTIONAL", async () => {
    const payload = {type: "Optional", value: null}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(null)
  })

  it("returns the correct response given a json-cdc payload 3 OPTIONAL", async () => {
    const payload = {type: "Optional", value: {type: "Int", value: "42"}}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(42)
  })

  it("returns the correct response given a json-cdc payload 4 VOID", async () => {
    const payload = {type: "Void"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(null)
  })

  it("returns the correct response given a json-cdc payload 5 BOOLEAN", async () => {
    const payload = {type: "Bool", value: true}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(true)
  })

  it("returns the correct response given a json-cdc payload 6 BOOLEAN", async () => {
    const payload = {type: "Bool", value: false}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(false)
  })

  it("returns the correct response given a json-cdc payload 7 STRING", async () => {
    const payload = {type: "String", value: ""}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual("")
  })

  it("returns the correct response given a json-cdc payload 8 STRING", async () => {
    const payload = {type: "String", value: "foo"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual("foo")
  })

  it("returns the correct response given a json-cdc payload 9 ADDRESS", async () => {
    const payload = {
      type: "Address",
      value: "0x0102030405000000000000000000000000000000",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual("0x0102030405000000000000000000000000000000")
  })

  it("returns the correct response given a json-cdc payload 10 ADDRESS", async () => {
    const payload = {
      type: "Address",
      value: "0x0102030405000000000000000000000000000000",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual("0x0102030405000000000000000000000000000000")
  })

  it("returns the correct response given a json-cdc payload 10 INT", async () => {
    const payload = {type: "Int", value: "-42"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(-42)
  })

  it("returns the correct response given a json-cdc payload 11 INT", async () => {
    const payload = {
      type: "Int",
      value:
        "115792089237316195423570985008687907853269984665640564039457584007913129639945",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(
      115792089237316195423570985008687907853269984665640564039457584007913129639945
    )
  })

  it("returns the correct response given a json-cdc payload 12 INT", async () => {
    const payload = {
      type: "Int",
      value:
        "-57896044618658097711785492504343953926634992332820282019728792003956564819978",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(
      -57896044618658097711785492504343953926634992332820282019728792003956564819978
    )
  })

  it("returns the correct response given a json-cdc payload 13 INT", async () => {
    const payload = {type: "Int", value: "0"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(0)
  })

  it("returns the correct response given a json-cdc payload 14 INT8", async () => {
    const payload = {type: "Int8", value: "-128"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(-128)
  })

  it("returns the correct response given a json-cdc payload 15 INT16", async () => {
    const payload = {type: "Int16", value: "32767"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(32767)
  })

  it("returns the correct response given a json-cdc payload 16 INT32", async () => {
    const payload = {type: "Int32", value: "2147483647"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(2147483647)
  })

  it("returns the correct response given a json-cdc payload 17 INT64", async () => {
    const payload = {type: "Int64", value: "-9223372036854775808"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(-9223372036854775808)
  })

  it("returns the correct response given a json-cdc payload 18 INT128", async () => {
    const payload = {
      type: "Int128",
      value: "-170141183460469231731687303715884105727",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(-170141183460469231731687303715884105727)
  })

  it("returns the correct response given a json-cdc payload 19 INT256", async () => {
    const payload = {
      type: "Int256",
      value:
        "57896044618658097711785492504343953926634992332820282019728792003956564819967",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(
      57896044618658097711785492504343953926634992332820282019728792003956564819967
    )
  })

  it("returns the correct response given a json-cdc payload 20 UINT", async () => {
    const payload = {
      type: "UInt",
      value:
        "115792089237316195423570985008687907853269984665640564039457584007913129639945",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(
      115792089237316195423570985008687907853269984665640564039457584007913129639945
    )
  })

  it("returns the correct response given a json-cdc payload 21 UINT8", async () => {
    const payload = {type: "UInt8", value: "255"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(255)
  })

  it("returns the correct response given a json-cdc payload 22 UINT16", async () => {
    const payload = {type: "UInt16", value: "65535"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(65535)
  })

  it("returns the correct response given a json-cdc payload 23 UINT32", async () => {
    const payload = {type: "UInt32", value: "4294967295"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(4294967295)
  })

  it("returns the correct response given a json-cdc payload 24 UINT64", async () => {
    const payload = {type: "UInt64", value: "18446744073709551615"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(18446744073709551615)
  })

  it("returns the correct response given a json-cdc payload 25 UINT128", async () => {
    const payload = {
      type: "UInt128",
      value: "340282366920938463463374607431768211455",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(340282366920938463463374607431768211455)
  })

  it("returns the correct response given a json-cdc payload 26 UINT256", async () => {
    const payload = {
      type: "UInt256",
      value:
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(
      115792089237316195423570985008687907853269984665640564039457584007913129639935
    )
  })

  it("returns the correct response given a json-cdc payload 27 WORD8", async () => {
    const payload = {type: "Word8", value: "255"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(255)
  })

  it("returns the correct response given a json-cdc payload 28 WORD16", async () => {
    const payload = {type: "Word16", value: "65535"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(65535)
  })

  it("returns the correct response given a json-cdc payload 29 WORD32", async () => {
    const payload = {type: "Word32", value: "4294967295"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(4294967295)
  })

  it("returns the correct response given a json-cdc payload 30 WORD64", async () => {
    const payload = {type: "Word64", value: "18446744073709551615"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual(18446744073709551615)
  })

  it("returns the correct response given a json-cdc payload 31 FIX64", async () => {
    const payload = {type: "Fix64", value: "789.00123010"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual("789.00123010")
  })

  it("returns the correct response given a json-cdc payload 32 FIX64", async () => {
    const payload = {type: "Fix64", value: "-12345.00678900"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual("-12345.00678900")
  })

  it("returns the correct response given a json-cdc payload 33 UFIX64", async () => {
    const payload = {type: "UFix64", value: "789.00123010"}

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual("789.00123010")
  })

  it("returns the correct response given a json-cdc payload 34 ARRAY", async () => {
    const payload = {
      type: "Array",
      value: [
        {type: "Int", value: "1"},
        {type: "Int", value: "2"},
        {type: "Int", value: "3"},
      ],
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual([1, 2, 3])
  })

  it("returns the correct response given a json-cdc payload 35 ARRAY", async () => {
    const payload = {
      type: "Array",
      value: [
        {
          type: "Resource",
          value: {
            id: "test.Foo",
            fields: [{name: "bar", value: {type: "Int", value: "1"}}],
          },
        },
        {
          type: "Resource",
          value: {
            id: "test.Foo",
            fields: [{name: "bar", value: {type: "Int", value: "2"}}],
          },
        },
        {
          type: "Resource",
          value: {
            id: "test.Foo",
            fields: [{name: "bar", value: {type: "Int", value: "3"}}],
          },
        },
      ],
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual([{bar: 1}, {bar: 2}, {bar: 3}])
  })

  it("returns the correct response given a json-cdc payload 36 DICTIONARY", async () => {
    const payload = {
      type: "Dictionary",
      value: [
        {key: {type: "String", value: "a"}, value: {type: "Int", value: "1"}},
        {key: {type: "String", value: "b"}, value: {type: "Int", value: "2"}},
        {key: {type: "String", value: "c"}, value: {type: "Int", value: "3"}},
      ],
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({a: 1, b: 2, c: 3})
  })

  it("returns the correct response given a json-cdc payload 37 DICTIONARY", async () => {
    const payload = {
      type: "Dictionary",
      value: [
        {
          key: {type: "String", value: "a"},
          value: {
            type: "Dictionary",
            value: [
              {
                key: {type: "String", value: "1"},
                value: {type: "Int", value: "1"},
              },
            ],
          },
        },
        {
          key: {type: "String", value: "b"},
          value: {
            type: "Dictionary",
            value: [
              {
                key: {type: "String", value: "2"},
                value: {type: "Int", value: "2"},
              },
            ],
          },
        },
        {
          key: {type: "String", value: "c"},
          value: {
            type: "Dictionary",
            value: [
              {
                key: {type: "String", value: "3"},
                value: {type: "Int", value: "3"},
              },
            ],
          },
        },
      ],
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({a: {1: 1}, b: {2: 2}, c: {3: 3}})
  })

  it("returns the correct response given a json-cdc payload 38 DICTIONARY", async () => {
    const payload = {
      type: "Dictionary",
      value: [
        {
          key: {type: "String", value: "a"},
          value: {
            type: "Resource",
            value: {
              id: "test.Foo",
              fields: [{name: "bar", value: {type: "Int", value: "1"}}],
            },
          },
        },
        {
          key: {type: "String", value: "b"},
          value: {
            type: "Resource",
            value: {
              id: "test.Foo",
              fields: [{name: "bar", value: {type: "Int", value: "2"}}],
            },
          },
        },
        {
          key: {type: "String", value: "c"},
          value: {
            type: "Resource",
            value: {
              id: "test.Foo",
              fields: [{name: "bar", value: {type: "Int", value: "3"}}],
            },
          },
        },
      ],
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({a: {bar: 1}, b: {bar: 2}, c: {bar: 3}})
  })

  it("returns the correct response given a json-cdc payload 39 RESOURCE", async () => {
    const payload = {
      type: "Resource",
      value: {
        id: "test.Foo",
        fields: [{name: "bar", value: {type: "Int", value: "42"}}],
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({bar: 42})
  })

  it("returns the correct response given a json-cdc payload 40 RESOURCE", async () => {
    const payload = {
      type: "Resource",
      value: {
        id: "test.Foo",
        fields: [
          {
            name: "bar",
            value: {
              type: "Resource",
              value: {
                id: "test.Bar",
                fields: [{name: "x", value: {type: "Int", value: "42"}}],
              },
            },
          },
        ],
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({bar: {x: 42}})
  })

  it("returns the correct response given a json-cdc payload 41 STRUCT", async () => {
    const payload = {
      type: "Struct",
      value: {
        id: "test.FooStruct",
        fields: [
          {name: "a", value: {type: "Int", value: "1"}},
          {name: "b", value: {type: "String", value: "foo"}},
        ],
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({a: 1, b: "foo"})
  })

  it("returns the correct response given a json-cdc payload 42 STRUCT", async () => {
    const payload = {
      type: "Struct",
      value: {
        id: "test.FooStruct",
        fields: [
          {name: "a", value: {type: "String", value: "foo"}},
          {
            name: "b",
            value: {
              type: "Resource",
              value: {
                id: "test.Foo",
                fields: [{name: "bar", value: {type: "Int", value: "42"}}],
              },
            },
          },
        ],
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({a: "foo", b: {bar: 42}})
  })

  it("returns the correct response given a json-cdc payload 43 STRUCT", async () => {
    const payload = {
      type: "Struct",
      value: {
        id: "test.FooStruct",
        fields: [
          {name: "a", value: {type: "String", value: "foo"}},
          {
            name: "b",
            value: {
              type: "Resource",
              value: {
                id: "test.Foo",
                fields: [{name: "bar", value: {type: "Int", value: "42"}}],
              },
            },
          },
        ],
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({a: "foo", b: {bar: 42}})
  })

  it("returns the correct response given a json-cdc payload 44 EVENT", async () => {
    const payload = {
      type: "Event",
      value: {
        id: "test.FooEvent",
        fields: [
          {name: "a", value: {type: "Int", value: "1"}},
          {name: "b", value: {type: "String", value: "foo"}},
        ],
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({a: 1, b: "foo"})
  })

  it("returns the correct response given a json-cdc payload 44 EVENT", async () => {
    const payload = {
      type: "Event",
      value: {
        id: "test.FooEvent",
        fields: [
          {name: "a", value: {type: "String", value: "foo"}},
          {
            name: "b",
            value: {
              type: "Resource",
              value: {
                id: "test.Foo",
                fields: [{name: "bar", value: {type: "Int", value: "42"}}],
              },
            },
          },
        ],
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({a: "foo", b: {bar: 42}})
  })

  it("returns the correct response given a json-cdc payload 45 TYPE", async () => {
    const payload = {
      type: "Type",
      value: {
        staticType: "FooType"
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual("FooType")
  })

  it("returns the correct response given a json-cdc payload 46 PATH", async () => {
    const payload = {
      type: "Path",
      value: {
        domain: "storage",
        identifier: "123abc"
      },
    }

    const decoded = await decode(payload)

    expect(decoded).toStrictEqual({
      domain: "storage",
      identifier: "123abc"
    })
  })
})

// Boolean
const genBool = () => {
  const OPTIONS = [true, false]
  const value = OPTIONS[~~(Math.random() * OPTIONS.length)]
  return {payload: {type: "Bool", value}, decoded: value}
}
const genBoolSpec = () => {
  const {payload, decoded} = genBool()
  return {
    label: `Boolean -- ${payload.value}`,
    payload,
    decoded,
  }
}

// Void
const genVoid = () => {
  return {
    payload: {type: "Void"},
    decoded: null,
  }
}
const genVoidSpec = () => {
  const {payload, decoded} = genVoid()
  return {
    label: `Void`,
    payload,
    decoded,
  }
}

// Int
const genInt = () => {
  const minInt256 = -57896044618658097711785492504343953926634992332820282019728792003956564819978
  const maxUInt256 = 115792089237316195423570985008687907853269984665640564039457584007913129639945
  const ranInt = ~~(Math.random() * (maxUInt256 - minInt256) + minInt256)
  return {
    payload: {type: "Int", value: ranInt.toString()},
    decoded: ranInt,
  }
}
const genIntSpec = () => {
  const {payload, decoded} = genInt()
  return {
    label: `Int -- ${decoded}`,
    payload,
    decoded,
  }
}

// String
const genString = () => {
  const stringLen = ~~(100 * Math.random())
  const ranString = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, stringLen)
  return {
    payload: {type: "String", value: ranString},
    decoded: ranString,
  }
}
const genStringSpec = () => {
  const {payload, decoded} = genString()
  return {
    label: `String -- ${decoded}`,
    payload,
    decoded,
  }
}

// Dictionary
const genDictionary = (depth = 0) => {
  const MAXDEPTH = 5
  if (depth >= MAXDEPTH) {
    return {
      payload: {type: "Dictionary", value: []},
      decoded: {},
    }
  }
  const OPTIONS = [
    genString,
    genInt,
    genBool,
    genVoid,
    () => genDictionary(depth++),
    () => genResource(depth++),
    () => genStruct(depth++),
    () => genEvent(depth++),
    () => genArray(depth++),
    () => genEnum(depth++),
  ]
  const dictionaryLength = ~~(Math.random() * 10)
  const arr = Array.from({length: dictionaryLength}).reduce(
    acc => {
      const {payload: valPayload, decoded: val} = OPTIONS[
        ~~(Math.random() * OPTIONS.length)
      ]()
      const {payload: keyPayload, decoded: ranStringKey} = genString()
      acc.dict.push({
        key: keyPayload,
        value: valPayload,
      })
      acc.decoded = {
        ...acc.decoded,
        [ranStringKey]: val,
      }
      return acc
    },
    {dict: [], decoded: {}}
  )
  return {
    payload: {type: "Dictionary", value: arr.dict},
    decoded: arr.decoded,
  }
}
const genDictionarySpec = () => {
  const {payload, decoded} = genDictionary()
  return {
    label: `Dictionary`,
    payload,
    decoded,
  }
}

const genResource = (depth = 0) => {
  const MAXDEPTH = 5
  if (depth >= MAXDEPTH) {
    return {
      payload: {type: "Resource", value: {fields: []}},
      decoded: {},
    }
  }
  const OPTIONS = [
    genString,
    genInt,
    genBool,
    genVoid,
    () => genDictionary(depth++),
    () => genResource(depth++),
    () => genStruct(depth++),
    () => genEvent(depth++),
    () => genArray(depth++),
    () => genEnum(depth++),
  ]
  const fieldsLength = ~~(Math.random() * 10)
  const res = Array.from({length: fieldsLength}).reduce(
    acc => {
      const {payload: valPayload, decoded: val} = OPTIONS[
        ~~(Math.random() * OPTIONS.length)
      ]()
      const {decoded: ranStringName} = genString()
      acc.fields.push({
        name: ranStringName,
        value: valPayload,
      })
      acc.decoded = {
        ...acc.decoded,
        [ranStringName]: val,
      }
      return acc
    },
    {fields: [], decoded: {}}
  )
  return {
    payload: {type: "Resource", value: {fields: res.fields}},
    decoded: res.decoded,
  }
}
const genResourceSpec = () => {
  const {payload, decoded} = genResource()
  return {
    label: `Resource`,
    payload,
    decoded,
  }
}

const genStruct = (depth = 0) => {
  const MAXDEPTH = 5
  if (depth >= MAXDEPTH) {
    return {
      payload: {type: "Struct", value: {fields: []}},
      decoded: {},
    }
  }
  const OPTIONS = [
    genString,
    genInt,
    genBool,
    genVoid,
    () => genDictionary(depth++),
    () => genResource(depth++),
    () => genStruct(depth++),
    () => genEvent(depth++),
    () => genArray(depth++),
    () => genEnum(depth++),
  ]
  const fieldsLength = ~~(Math.random() * 10)
  const res = Array.from({length: fieldsLength}).reduce(
    acc => {
      const {payload: valPayload, decoded: val} = OPTIONS[
        ~~(Math.random() * OPTIONS.length)
      ]()
      const {decoded: ranStringName} = genString()
      acc.fields.push({
        name: ranStringName,
        value: valPayload,
      })
      acc.decoded = {
        ...acc.decoded,
        [ranStringName]: val,
      }
      return acc
    },
    {fields: [], decoded: {}}
  )
  return {
    payload: {type: "Struct", value: {fields: res.fields}},
    decoded: res.decoded,
  }
}
const genStructSpec = () => {
  const {payload, decoded} = genStruct()
  return {
    label: `Struct`,
    payload,
    decoded,
  }
}

const genEvent = (depth = 0) => {
  const MAXDEPTH = 5
  if (depth >= MAXDEPTH) {
    return {
      payload: {type: "Event", value: {fields: []}},
      decoded: {},
    }
  }
  const OPTIONS = [
    genString,
    genInt,
    genBool,
    genVoid,
    () => genDictionary(depth++),
    () => genResource(depth++),
    () => genStruct(depth++),
    () => genEvent(depth++),
    () => genArray(depth++),
    () => genEnum(depth++),
  ]
  const fieldsLength = ~~(Math.random() * 10)
  const res = Array.from({length: fieldsLength}).reduce(
    acc => {
      const {payload: valPayload, decoded: val} = OPTIONS[
        ~~(Math.random() * OPTIONS.length)
      ]()
      const {decoded: ranStringName} = genString()
      acc.fields.push({
        name: ranStringName,
        value: valPayload,
      })
      acc.decoded = {
        ...acc.decoded,
        [ranStringName]: val,
      }
      return acc
    },
    {fields: [], decoded: {}}
  )
  return {
    payload: {type: "Event", value: {fields: res.fields}},
    decoded: res.decoded,
  }
}
const genEventSpec = () => {
  const {payload, decoded} = genEvent()
  return {
    label: `Event`,
    payload,
    decoded,
  }
}

const genEnum = (depth = 0) => {
  const MAXDEPTH = 5
  if (depth >= MAXDEPTH) {
    return {
      payload: {type: "Enum", value: {fields: []}},
      decoded: {},
    }
  }
  const OPTIONS = [
    genString,
    genInt,
    genBool,
    genVoid,
    () => genDictionary(depth++),
    () => genResource(depth++),
    () => genStruct(depth++),
    () => genEvent(depth++),
    () => genArray(depth++),
    () => genEnum(depth++),
  ]
  const fieldsLength = ~~(Math.random() * 10)
  const res = Array.from({length: fieldsLength}).reduce(
    acc => {
      const {payload: valPayload, decoded: val} = OPTIONS[
        ~~(Math.random() * OPTIONS.length)
      ]()
      const {decoded: ranStringName} = genString()
      acc.fields.push({
        name: ranStringName,
        value: valPayload,
      })
      acc.decoded = {
        ...acc.decoded,
        [ranStringName]: val,
      }
      return acc
    },
    {fields: [], decoded: {}}
  )
  return {
    payload: {type: "Enum", value: {fields: res.fields}},
    decoded: res.decoded,
  }
}
const genEnumSpec = () => {
  const {payload, decoded} = genEnum()
  return {
    label: `Enum`,
    payload,
    decoded,
  }
}

const genArray = (depth = 0) => {
  const MAXDEPTH = 5
  if (depth >= MAXDEPTH) {
    return {
      payload: {type: "Array", value: []},
      decoded: [],
    }
  }
  const OPTIONS = [
    genString,
    genInt,
    genBool,
    genVoid,
    () => genDictionary(depth++),
    () => genResource(depth++),
    () => genStruct(depth++),
    () => genEvent(depth++),
    () => genArray(depth++),
    () => genEnum(depth++),
  ]
  const fieldsLength = ~~(Math.random() * 10)
  const arr = Array.from({length: fieldsLength}).reduce(
    acc => {
      const {payload, decoded} = OPTIONS[~~(Math.random() * OPTIONS.length)]()
      acc.values.push(payload)
      acc.decoded.push(decoded)
      return acc
    },
    {values: [], decoded: []}
  )
  return {
    payload: {type: "Array", value: arr.values},
    decoded: arr.decoded,
  }
}
const genArraySpec = () => {
  const {payload, decoded} = genArray()
  return {
    label: `Array`,
    payload,
    decoded,
  }
}

const genType = () => {
  const {payload, decoded} = genString()
  return {
    payload: {type: "Type", value: { staticType: payload.value }},
    decoded: decoded,
  }
}
const genTypeSpec = () => {
  const {payload, decoded} = genType()
  return {
    label: `Type`,
    payload,
    decoded,
  }
}

const genPath = () => {
  const domains = ["storage", "private", "public"]
  const randDomain = domains[~~Math.random() * domains.length]
  const {payload, decoded} = genString()
  return {
    payload: {type: "Path", value: { domain: randDomain, identifier: payload.value }},
    decoded: {
      domain: randDomain,
      identifier: decoded
    },
  }
}
const genPathSpec = () => {
  const {payload, decoded} = genPath()
  return {
    label: `Path`,
    payload,
    decoded,
  }
}

const genCapability = () => {
  const {payload: payload1, decoded: decoded1} = genString()
  const {payload: payload2, decoded: decoded2} = genString()
  const {payload: payload3, decoded: decoded3} = genString()
  return {
    payload: {type: "Capability", value: { path: payload1.value, address: payload2.value, borrowType: payload3.value }},
    decoded: {
      path: decoded1,
      address: decoded2,
      borrowType: decoded3,
    },
  }
}
const genCapabilitySpec = () => {
  const {payload, decoded} = genCapability()
  return {
    label: `Capability`,
    payload,
    decoded,
  }
}

const times = fn => {
  const OPTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return Array.from({length: OPTS[~~(Math.random() * OPTS.length)]}, () => fn)
}

describe("generative tests", () => {
  ;[
    {
      label: "optional",
      payload: {type: "Optional", value: null},
      decoded: null,
    },
    ...times(genBoolSpec),
    ...times(genVoidSpec),
    ...times(genIntSpec),
    ...times(genStringSpec),
    ...times(genDictionarySpec),
    ...times(genResourceSpec),
    ...times(genStructSpec),
    ...times(genEventSpec),
    ...times(genArraySpec),
    ...times(genTypeSpec),
    ...times(genPathSpec),
    ...times(genEnumSpec),
    ...times(genCapabilitySpec),
  ]
    .filter(d => d != null)
    .map(d => {
      return typeof d === "function" ? d() : d
    })
    .forEach(({label, payload, decoded, custom}) => {
      it(label, async () =>
        expect(await decode(payload, custom || undefined)).toStrictEqual(
          decoded
        )
      )
    })
})

describe("custom decoder tests", () => {
  it("decodes using a custom decoder correctly", async () => {
    const resource = {
      type: "Resource",
      value: {
        id: "test.Foo",
        fields: [{name: "bar", value: {type: "Int", value: "1"}}],
      },
    }

    const fooDecoder = async resource => ({
      hello: "world",
    })

    const decoded = await decode(resource, {"test.Foo": fooDecoder})

    expect(decoded).toStrictEqual({
      hello: "world",
    })
  })

  it("decodes using a custom nested decoder correctly", async () => {
    const resource = {
      type: "Resource",
      value: {
        id: "test.Jeff",
        fields: [
          {name: "firstName", value: {type: "String", value: "Jeff"}},
          {name: "lastName", value: {type: "String", value: "Doyle"}},
        ],
      },
    }

    const Jeff = function(resource) {
      if (!(this instanceof Jeff)) return new Jeff(resource)
      this.firstName = resource.firstName
      this.lastName = resource.lastName
      this.printName = () => `${this.firstName} ${this.lastName}`
    }

    const jeffDecoder = async resource => {
      return Jeff(resource)
    }

    const decoded = await decode(resource, {"test.Jeff": jeffDecoder}, [])

    expect(decoded.printName()).toStrictEqual("Jeff Doyle")
  })

  it("decodes using a cusotm nested decoder correctly", async () => {
    const resource = {
      type: "Resource",
      value: {
        id: "test.CryptoKitty",
        fields: [
          {name: "kittyName", value: {type: "String", value: "Sir Meowsers"}},
          {
            name: "kittyHat",
            value: {
              type: "Resource",
              value: {
                id: "test.CryptoKittyHat",
                fields: [
                  {
                    name: "kittyHatName",
                    value: {type: "String", value: "Yankee With No Brim"},
                  },
                ],
              },
            },
          },
        ],
      },
    }

    const kittyHatDecoder = async kittyHat => ({
      name: kittyHat.kittyHatName,
    })

    const kittyDecoder = async kitty => ({
      name: kitty.kittyName,
      hat: kitty.kittyHat,
    })

    const decoded = await decode(resource, {
      "/test.CryptoKitty$/": kittyDecoder,
      "/test.CryptoKittyHat$/": kittyHatDecoder,
    })

    expect(decoded).toStrictEqual({
      name: "Sir Meowsers",
      hat: {
        name: "Yankee With No Brim",
      },
    })
  })

  it("decodes using a custom decoder with regex lookup", async () => {
    const resource = {
      type: "Resource",
      value: {
        id: "test.CryptoKitty",
        fields: [
          {name: "kittyName", value: {type: "String", value: "Sir Meowsers"}},
          {
            name: "kittyHat",
            value: {
              type: "Resource",
              value: {
                id: "test.CryptoKittyHat",
                fields: [
                  {
                    name: "kittyHatName",
                    value: {type: "String", value: "Yankee With No Brim"},
                  },
                ],
              },
            },
          },
        ],
      },
    }

    const kittyHatDecoder = async kittyHat => ({
      name: kittyHat.kittyHatName,
    })

    const kittyDecoder = async kitty => ({
      name: kitty.kittyName,
      hat: kitty.kittyHat,
    })

    const decoded = await decode(resource, {
      "/.CryptoKittyHat$/": kittyHatDecoder,
      "/.CryptoKitty$/": kittyDecoder,
    })

    expect(decoded).toStrictEqual({
      name: "Sir Meowsers",
      hat: {
        name: "Yankee With No Brim",
      },
    })
  })
})

describe("decode GetEvents tests", () => {
  it("decodes a GetEvents response correctly", async () => {
      const timestampISOString =new Date().toISOString()

      const getEventsResponse = {
        events: [{
          blockHeight: 123,
          blockId: "abc123",
          blockTimestamp: timestampISOString,
          eventIndex: 123,
          transactionId: "abc-123",
          transactionIndex: 123,
          type: "MyFunAndCoolEvent",
          payload: {type: "String", value: "foo"}
        }]
      }

      expect(await decodeResponse(getEventsResponse)).toStrictEqual(
        [{
          blockHeight: 123,
          blockId: "abc123",
          blockTimestamp: timestampISOString,
          eventIndex: 123,
          transactionId: "abc-123",
          transactionIndex: 123,
          type: "MyFunAndCoolEvent",
          data: "foo"
        }]
      )
  })
})

describe("decode GetTransactionStatus tests", () => {
  it("decodes a GetEvents response correctly", async () => {
      const getTransactionStatusResponse = {
        transactionStatus: {
          status: 4,
          statusCode: 1,
          errorMessage: null,
          events: [{
            type: "LilBUBTheMagicalSpaceCat.LandedOnMars",
            transactionId: "my-fun-and-very-special-txn-id",
            transactionIndex: 123456,
            eventIndex: 7891011,
            payload: {type: "String", value: "Thanks for reviewing these tests!"}
          }]
        }
      }

      expect(await decodeResponse(getTransactionStatusResponse)).toStrictEqual(
        { 
          status: 4,
          statusCode: 1,
          errorMessage: null,
          events: [{
            type: "LilBUBTheMagicalSpaceCat.LandedOnMars",
            transactionId: "my-fun-and-very-special-txn-id",
            transactionIndex: 123456,
            eventIndex: 7891011,
            data: "Thanks for reviewing these tests!"
          }]
        }
      )
  })
})
