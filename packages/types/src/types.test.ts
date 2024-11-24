import * as t from "./types"

registerTest([t.Int, "1", {type: "Int", value: "1"}, "1"])
registerTest([t.UInt, "1", {type: "UInt", value: "1"}, "1"])
registerTest([t.Int8, "8", {type: "Int8", value: "8"}, "8"])
registerTest([t.UInt8, "8", {type: "UInt8", value: "8"}, "8"])
registerTest([t.Int16, "16", {type: "Int16", value: "16"}, "16"])
registerTest([t.UInt16, "16", {type: "UInt16", value: "16"}, "16"])
registerTest([t.Int32, "32", {type: "Int32", value: "32"}, "32"])
registerTest([t.UInt32, "32", {type: "UInt32", value: "32"}, "32"])
registerTest([t.Int64, "64", {type: "Int64", value: "64"}, "64"])
registerTest([t.UInt64, "64", {type: "UInt64", value: "64"}, "64"])
registerTest([t.Int128, "128", {type: "Int128", value: "128"}, "128"])
registerTest([t.UInt128, "128", {type: "UInt128", value: "128"}, "128"])
registerTest([t.Int256, "256", {type: "Int256", value: "256"}, "256"])
registerTest([t.UInt256, "256", {type: "UInt256", value: "256"}, "256"])
registerTest([t.Word8, "8", {type: "Word8", value: "8"}, "8"])
registerTest([t.Word16, "16", {type: "Word16", value: "16"}, "16"])
registerTest([t.Word32, "32", {type: "Word32", value: "32"}, "32"])
registerTest([t.Word64, "64", {type: "Word64", value: "64"}, "64"])
registerTest([t.Word128, "128", {type: "Word128", value: "128"}, "128"])
registerTest([t.Word256, "256", {type: "Word256", value: "256"}, "256"])
registerTest([t.UFix64, "64", {type: "UFix64", value: "64"}, "64", true])
registerTest([t.Fix64, "64", {type: "Fix64", value: "64"}, "64", true])
registerTest([
  t.UFix64,
  "64.000000001",
  {type: "UFix64", value: "64.000000001"},
  "64.000000001",
  true,
])
registerTest([
  t.Fix64,
  "64.000000001",
  {type: "Fix64", value: "64.000000001"},
  "64.000000001",
  true,
])
registerTest([
  t.UFix64,
  "64.0",
  {type: "UFix64", value: "64.00000000"},
  "64.0",
  false,
])
registerTest([
  t.Fix64,
  "64.0",
  {type: "Fix64", value: "64.00000000"},
  "64.0",
  false,
])
registerTest([
  t.String,
  "Go with the Flow",
  {type: "String", value: "Go with the Flow"},
  "Go with the Flow",
])
registerTest([t.Character, "c", {type: "Character", value: "c"}, "c"])
registerTest([t.Bool, true, {type: "Bool", value: true}, true])
registerTest([t.Address, "0x1", {type: "Address", value: "0x1"}, "0x1"])
registerTest([t.Void, null, {type: "Void", value: null}, null])
registerTest([
  t.Optional(t.String),
  null,
  {type: "Optional", value: null},
  null,
])
registerTest([
  t.Optional(t.String),
  "test",
  {type: "Optional", value: {type: "String", value: "test"}},
  "test",
])
registerTest([
  t.Reference,
  {address: "0x01", type: "0x01.CryptoKitty"},
  {type: "Reference", value: {address: "0x01", type: "0x01.CryptoKitty"}},
  {address: "0x01", type: "0x01.CryptoKitty"},
])
registerTest([
  t.Array(t.String),
  ["test"],
  {type: "Array", value: [{type: "String", value: "test"}]},
  ["test"],
])
registerTest([
  t.Array([t.String, t.String]),
  ["test1", "test2"],
  {
    type: "Array",
    value: [
      {type: "String", value: "test1"},
      {type: "String", value: "test2"},
    ],
  },
  ["test1", "test2"],
])
registerTest([
  t.Dictionary([
    {key: t.Int, value: t.String},
    {key: t.Int, value: t.String},
  ]),
  [
    {key: "1", value: "one"},
    {key: "2", value: "two"},
  ],
  {
    type: "Dictionary",
    value: [
      {key: {type: "Int", value: "1"}, value: {type: "String", value: "one"}},
      {key: {type: "Int", value: "2"}, value: {type: "String", value: "two"}},
    ],
  },
  [
    {key: "1", value: "one"},
    {key: "2", value: "two"},
  ],
])
registerTest([
  t.Dictionary({key: t.Int, value: t.String}),
  {key: "1", value: "one"},
  {
    type: "Dictionary",
    value: [
      {key: {type: "Int", value: "1"}, value: {type: "String", value: "one"}},
    ],
  },
  {key: "1", value: "one"},
])
registerTest([
  t.Struct("0x01.Jeffysaur", [{value: t.String}]),
  {fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}]},
  {
    type: "Struct",
    value: {
      id: "0x01.Jeffysaur",
      fields: [
        {
          name: "Jeffysaur_Name",
          value: {type: "String", value: "Mr Jeff The Dinosaur"},
        },
      ],
    },
  },
  {fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}]},
])
registerTest([
  t.Enum("0x01.SuperEnum", [{value: t.String}]),
  {fields: [{name: "SuperKey1", value: "SuperValue1"}]},
  {
    type: "Enum",
    value: {
      id: "0x01.SuperEnum",
      fields: [
        {name: "SuperKey1", value: {type: "String", value: "SuperValue1"}},
      ],
    },
  },
  {fields: [{name: "SuperKey1", value: "SuperValue1"}]},
])
registerTest([
  t.Event("0x01.JeffWroteSomeJS", [{value: t.String}]),
  {fields: [{name: "wasTheCodeClean?", value: "absolutely"}]},
  {
    type: "Event",
    value: {
      id: "0x01.JeffWroteSomeJS",
      fields: [
        {
          name: "wasTheCodeClean?",
          value: {type: "String", value: "absolutely"},
        },
      ],
    },
  },
  {fields: [{name: "wasTheCodeClean?", value: "absolutely"}]},
])
registerTest([
  t.Resource("0x01.Jeffysaur", [{value: t.String}]),
  {fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}]},
  {
    type: "Resource",
    value: {
      id: "0x01.Jeffysaur",
      fields: [
        {
          name: "Jeffysaur_Name",
          value: {type: "String", value: "Mr Jeff The Dinosaur"},
        },
      ],
    },
  },
  {fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}]},
])
registerTest([
  t.Path,
  {
    domain: "public" as "storage" | "private" | "public",
    identifier: "flowTokenVault",
  },
  {type: "Path", value: {domain: "public", identifier: "flowTokenVault"}},
  {
    domain: "public" as "storage" | "private" | "public",
    identifier: "flowTokenVault",
  },
])
registerTest([
  t.Path,
  {
    domain: "notValidDomain" as "storage" | "private" | "public",
    identifier: "flowTokenVault",
  },
  {
    type: "Path",
    value: {
      domain: "notValidDomain" as "storage" | "private" | "public",
      identifier: "flowTokenVault",
    },
  },
  {
    domain: "notValidDomain" as "storage" | "private" | "public",
    identifier: "flowTokenVault",
  },
  true,
])
registerTest([
  t.InclusiveRange(t.Int),
  {
    start: 5,
    end: 10,
    step: 1,
  },
  {
    type: "InclusiveRange",
    value: {
      start: {type: "Int", value: "5"},
      end: {type: "Int", value: "10"},
      step: {type: "Int", value: "1"},
    },
  },
  {
    start: 5,
    end: 10,
    step: 1,
  },
])

function registerTest<X, Y extends string, Z>([
  cast,
  input,
  asArgument,
  asInjection,
  shouldError = false,
]: readonly [
  t.TypeDescriptor<X, t.JsonCdc<Y, Z>>,
  X,
  t.JsonCdc<Y, Z>,
  X,
  boolean?,
]) {
  describe(cast.label, () => {
    test(`t.${cast.label}.asArgument(${input})`, () => {
      if (shouldError) {
        expect(() => cast.asArgument(input)).toThrow()
      } else {
        expect(cast.asArgument(input)).toStrictEqual(asArgument)
      }
    })
    test(`t.${cast.label}.asInjection(${input})`, () => {
      expect(cast.asInjection(input)).toStrictEqual(asInjection)
    })
  })
}
