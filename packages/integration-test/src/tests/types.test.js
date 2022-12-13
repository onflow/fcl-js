import * as fcl from "@onflow/fcl"
let authz

describe("types test", () => {
  beforeAll(() => {
    authz = global.__authz__
  })

  test.each([
    // UInt
    // arbitrary large number
    [
      "1093847182501623192840",
      "UInt",
      fcl.t.UInt,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    // unsigned can't be negative
    [
      "-1",
      "UInt",
      fcl.t.UInt,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // UInt8
    // boundary tests
    [
      "0",
      "UInt8",
      fcl.t.UInt8,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "255",
      "UInt8",
      fcl.t.UInt8,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^8 - 1
    // out of boundary tests
    [
      "-1",
      "UInt8",
      fcl.t.UInt8,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "256",
      "UInt8",
      fcl.t.UInt8,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // UInt16
    // boundary tests
    [
      "0",
      "UInt16",
      fcl.t.UInt16,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "65535",
      "UInt16",
      fcl.t.UInt16,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^16 - 1
    // out of boundary tests
    [
      "-1",
      "UInt16",
      fcl.t.UInt16,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "65536",
      "UInt16",
      fcl.t.UInt16,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // UInt32
    // boundary tests
    [
      "0",
      "UInt32",
      fcl.t.UInt32,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "4294967295",
      "UInt32",
      fcl.t.UInt32,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^32 - 1
    // out of boundary tests
    [
      "-1",
      "UInt32",
      fcl.t.UInt32,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "4294967296",
      "UInt32",
      fcl.t.UInt32,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // UInt64
    // boundary tests
    [
      "0",
      "UInt64",
      fcl.t.UInt64,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "18446744073709551615",
      "UInt64",
      fcl.t.UInt64,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^64 - 1
    // out of boundary tests
    [
      "-1",
      "UInt64",
      fcl.t.UInt64,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "18446744073709551616",
      "UInt64",
      fcl.t.UInt64,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // UInt128
    // boundary tests
    [
      "0",
      "UInt128",
      fcl.t.UInt128,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "340282366920938463463374607431768211455",
      "UInt128",
      fcl.t.UInt128,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^128 - 1
    // out of boundary tests
    [
      "-1",
      "UInt128",
      fcl.t.UInt128,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "340282366920938463463374607431768211456",
      "UInt128",
      fcl.t.UInt128,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // UInt256
    // boundary tests
    [
      "0",
      "UInt256",
      fcl.t.UInt256,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      "UInt256",
      fcl.t.UInt256,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^256 - 1
    // out of boundary tests
    [
      "-1",
      "UInt256",
      fcl.t.UInt256,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "115792089237316195423570985008687907853269984665640564039457584007913129639936",
      "UInt256",
      fcl.t.UInt256,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // Int
    // arbitrary large number
    [
      "9435791823418734917346812763",
      "Int",
      fcl.t.Int,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    // arbitrary small number
    [
      "-3123948761937418927643812",
      "Int",
      fcl.t.Int,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],

    // Int8
    // boundary tests
    [
      "-128",
      "Int8",
      fcl.t.Int8,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // -2^7
    [
      "127",
      "Int8",
      fcl.t.Int8,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^7 - 1
    // out of boundary tests
    [
      "-129",
      "Int8",
      fcl.t.Int8,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "128",
      "Int8",
      fcl.t.Int8,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // Int16
    // boundary tests
    [
      "-32768",
      "Int16",
      fcl.t.Int16,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // -2^15
    [
      "32767",
      "Int16",
      fcl.t.Int16,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^15 - 1
    // out of boundary tests
    [
      "-32769",
      "Int16",
      fcl.t.Int16,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "32768",
      "Int16",
      fcl.t.Int16,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // Int32
    // boundary tests
    [
      "-2147483648",
      "Int32",
      fcl.t.Int32,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // -2^31
    [
      "2147483647",
      "Int32",
      fcl.t.Int32,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^31 - 1
    // out of boundary tests
    [
      "-2147483649",
      "Int32",
      fcl.t.Int32,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "2147483648",
      "Int32",
      fcl.t.Int32,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // Int64
    // boundary tests
    [
      "-9223372036854775808",
      "Int64",
      fcl.t.Int64,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // -2^63
    [
      "9223372036854775807",
      "Int64",
      fcl.t.Int64,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^63 - 1
    // out of boundary tests
    [
      "-9223372036854775809",
      "Int64",
      fcl.t.Int64,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "9223372036854775808",
      "Int64",
      fcl.t.Int64,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // Int128
    // boundary tests
    [
      "-170141183460469231731687303715884105728",
      "Int128",
      fcl.t.Int128,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // -2^127
    [
      "170141183460469231731687303715884105727",
      "Int128",
      fcl.t.Int128,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^127 - 1
    // out of boundary tests
    [
      "-170141183460469231731687303715884105729",
      "Int128",
      fcl.t.Int128,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "170141183460469231731687303715884105729",
      "Int128",
      fcl.t.Int128,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // Int256
    // boundary tests
    [
      "-57896044618658097711785492504343953926634992332820282019728792003956564819968",
      "Int256",
      fcl.t.Int256,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // -2^255
    [
      "57896044618658097711785492504343953926634992332820282019728792003956564819967",
      "Int256",
      fcl.t.Int256,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ], // 2^255 - 1
    // out of boundary tests
    [
      "-57896044618658097711785492504343953926634992332820282019728792003956564819969",
      "Int256",
      fcl.t.Int256,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "57896044618658097711785492504343953926634992332820282019728792003956564819968",
      "Int256",
      fcl.t.Int256,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // UFix64
    // boundary tests
    [
      "0.0",
      "UFix64",
      fcl.t.UFix64,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "184467440737.09551615",
      "UFix64",
      fcl.t.UFix64,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    // out of boundary tests
    [
      "-0.00000001", // -1 / 1,000,000,000
      "UFix64",
      fcl.t.UFix64,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "184467440737.09551616",
      "UFix64",
      fcl.t.UFix64,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // Fix64
    // boundary tests
    [
      "-92233720368.54775808",
      "Fix64",
      fcl.t.Fix64,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "92233720368.54775807",
      "Fix64",
      fcl.t.Fix64,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    // out of boundary tests
    [
      "-92233720368.54775809",
      "Fix64",
      fcl.t.Fix64,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "92233720368.54775808",
      "Fix64",
      fcl.t.Fix64,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // String
    [
      "",
      "String",
      fcl.t.String,
      testFn => expect(testFn()).resolves.toMatch(""),
    ],
    [
      "This is the way",
      "String",
      fcl.t.String,
      testFn => expect(testFn()).resolves.toMatch("This is the way"),
    ],
    [
      "Rand0m \0str!ng \t with \u{FC} symbo\\s\n",
      "String",
      fcl.t.String,
      async testFn =>
        await expect(testFn()).resolves.toMatch(
          "Rand0m \0str!ng \t with ü symbo\\s\n"
        ),
    ],

    // Character
    [
      "\0",
      "Character",
      fcl.t.Character,
      testFn => expect(testFn()).resolves.toMatch("\0"),
    ],
    [
      "T",
      "Character",
      fcl.t.Character,
      testFn => expect(testFn()).resolves.toMatch("T"),
    ],
    [
      "\u{FC}",
      "String",
      fcl.t.String,
      async testFn => await expect(testFn()).resolves.toMatch("ü"),
    ],

    // Bool
    [true, "Bool", fcl.t.Bool, testFn => expect(testFn()).resolves.toBe(true)],
    [
      false,
      "Bool",
      fcl.t.Bool,
      testFn => expect(testFn()).resolves.toBe(false),
    ],

    // Address
    // boundary tests
    [
      "0x000000000000",
      "Address",
      fcl.t.Address,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      "0xFFFFFFFFFFFF",
      "Address",
      fcl.t.Address,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    // out of boundary tests
    [
      "0xFFFFFFFFFFFFF",
      "Address",
      fcl.t.Address,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "0xFFGFFFFFFFFF",
      "Address",
      fcl.t.Address,
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],

    // Optional
    [
      null,
      "String?",
      fcl.t.Optional(fcl.t.String),
      testFn => expect(testFn()).resolves.toBe(null),
    ],
    [
      null,
      "Address?",
      fcl.t.Optional(fcl.t.Address),
      testFn => expect(testFn()).resolves.toBe(null),
    ],
    [
      null,
      "Int?",
      fcl.t.Optional(fcl.t.Int),
      async testFn => await expect(testFn()).resolves.toBe(null),
    ],

    // Array
    [
      ["1", "-1", "1902492435", "-15982361925"],
      "[Int]",
      fcl.t.Array(fcl.t.Int),
      testFn =>
        expect(testFn()).resolves.toStrictEqual([
          "1",
          "-1",
          "1902492435",
          "-15982361925",
        ]),
    ],
    [
      [
        ["112351238", "-6128301"],
        ["123865913", "-69127644"],
      ],
      "[[Int128]]",
      fcl.t.Array(fcl.t.Array(fcl.t.Int128)),
      testFn =>
        expect(testFn()).resolves.toStrictEqual([
          ["112351238", "-6128301"],
          ["123865913", "-69127644"],
        ]),
    ],
    [
      ["Dracarys", null, true, "8"],
      "[AnyStruct]",
      fcl.t.Array([
        fcl.t.String,
        fcl.t.Optional(fcl.t.Address),
        fcl.t.Bool,
        fcl.t.Int8,
      ]),
      async testFn =>
        await expect(testFn()).resolves.toStrictEqual([
          "Dracarys",
          null,
          true,
          "8",
        ]),
    ],
    // non optional address -> error
    [
      ["Dracarys", null, true, "8"],
      "[AnyStruct]",
      fcl.t.Array([fcl.t.String, fcl.t.Address, fcl.t.Bool, fcl.t.Int8]),
      async testFn => await expect(testFn()).rejects.toBeDefined(),
    ],

    // Dictionary
    [
      [
        {key: "1", value: "one"},
        {key: "2", value: "two"},
      ],
      "{Int: String}",
      fcl.t.Dictionary({key: fcl.t.Int, value: fcl.t.String}),
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
    [
      [
        {key: "0xFFFFFFFFFFFF", value: ["24014121", "Types", true, "n"]},
        {key: "0xFFFFFFFFFFFA", value: [null, "Flow", false, "G"]},
      ],
      "{Address: [AnyStruct]}",
      fcl.t.Dictionary({
        key: fcl.t.Address,
        value: fcl.t.Array([
          fcl.t.Optional(fcl.t.Int),
          fcl.t.String,
          fcl.t.Bool,
          fcl.t.Character,
        ]),
      }),
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],

    // Path
    [
      {
        domain: "public",
        identifier: "flowTokenVault",
      },
      "Path",
      fcl.t.Path,
      testFn => expect(testFn()).resolves.toBeDefined(),
    ],
  ])(
    "Type test value %s with type %s",
    async (value, transactionType, fclType, expectFn) => {
      const testFn = async () =>
        await fcl
          .send([
            fcl.script(`
                pub fun main(a: ${transactionType}): ${transactionType} {
                    log(a)
                    return a
                }
            `),
            fcl.args([fcl.arg(value, fclType)]),
            fcl.limit(100),
          ])
          .then(fcl.decode)

      await expectFn(testFn)
    }
  )

  test.each([
    // Word 8
    // Out of boundary tests
    [
      "-1",
      "255", // 2^8 - 1
      "Word8",
      "Word8",
      fcl.t.Word8,
      fcl.t.Word8,
      "Word8",
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "1",
      "256",
      "Word8",
      "Word8",
      fcl.t.Word8,
      fcl.t.Word8,
      "Word8",
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    // Word addition causes overflow
    [
      "1",
      "255",
      "Word8",
      "Word8",
      fcl.t.Word8,
      fcl.t.Word8,
      "Word8",
      async testFn => await expect(testFn()).resolves.toEqual("0"),
    ],

    // Word 16
    // Out of boundary tests
    [
      "-1",
      "65535", // 2^16 - 1
      "Word16",
      "Word16",
      fcl.t.Word16,
      fcl.t.Word16,
      "Word16",
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "1",
      "65536",
      "Word16",
      "Word16",
      fcl.t.Word16,
      fcl.t.Word16,
      "Word16",
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    // Word addition causes overflow
    [
      "1",
      "65535",
      "Word16",
      "Word16",
      fcl.t.Word16,
      fcl.t.Word16,
      "Word16",
      async testFn => await expect(testFn()).resolves.toEqual("0"),
    ],

    // Word32
    // Out of boundary tests
    [
      "-1",
      "4294967295", // 2^32 - 1
      "Word32",
      "Word32",
      fcl.t.Word32,
      fcl.t.Word32,
      "Word32",
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "1",
      "4294967296",
      "Word32",
      "Word32",
      fcl.t.Word32,
      fcl.t.Word32,
      "Word32",
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    // Word addition causes overflow
    [
      "1",
      "4294967295",
      "Word32",
      "Word32",
      fcl.t.Word32,
      fcl.t.Word32,
      "Word32",
      async testFn => await expect(testFn()).resolves.toEqual("0"),
    ],

    // Word64
    // Out of boundary tests
    [
      "-1",
      "18446744073709551615", // 2^64 - 1
      "Word64",
      "Word64",
      fcl.t.Word64,
      fcl.t.Word64,
      "Word64",
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    [
      "1",
      "18446744073709551616",
      "Word64",
      "Word64",
      fcl.t.Word64,
      fcl.t.Word64,
      "Word64",
      async testFn =>
        await expect(testFn()).rejects.toBeDefined(),
    ],
    // Word addition causes overflow
    [
      "1",
      "18446744073709551615",
      "Word64",
      "Word64",
      fcl.t.Word64,
      fcl.t.Word64,
      "Word64",
      async testFn => await expect(testFn()).resolves.toEqual("0"),
    ],
  ])(
    "Addition type test %s + %s with type %s and %s",
    async (
      valueA,
      valueB,
      typeA,
      typeB,
      fclTypeA,
      fclTypeB,
      returnType,
      expectFn
    ) => {
      const testFn = async () =>
        await fcl
          .send([
            fcl.script(`
                pub fun main(a: ${typeA}, b: ${typeB}): ${returnType} {
                    return a + b
                }
            `),
            fcl.args([fcl.arg(valueA, fclTypeA), fcl.arg(valueB, fclTypeB)]),
            fcl.limit(100),
          ])
          .then(fcl.decode)

      await expectFn(testFn)
    }
  )
})
