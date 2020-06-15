import * as t from "./types.js"
;[
  [t.Identity, 0, 0, 0],
  [t.Identity, "a", "a", "a"],
  [t.Identity, null, null, null],
  [t.Int, 1, {type: "Int", value: 1}, 1],
  [t.UInt, 1, {type: "UInt", value: 1}, 1],
  [t.Int8, 8, {type: "Int8", value: 8}, 8],
  [t.UInt8, 8, {type: "UInt8", value: 8}, 8],
  [t.Int16, 16, {type: "Int16", value: 16}, 16],
  [t.UInt16, 16, {type: "UInt16", value: 16}, 16],
  [t.Int32, 32, {type: "Int32", value: 32}, 32],
  [t.UInt32, 32, {type: "UInt32", value: 32}, 32],
  [t.Int64, 64, {type: "Int64", value: 64}, 64],
  [t.UInt64, 64, {type: "UInt64", value: 64}, 64],
  [t.Int128, 128, {type: "Int128", value: 128}, 128],
  [t.UInt128, 128, {type: "UInt128", value: 128}, 128],
  [t.Int256, 256, {type: "Int256", value: 256}, 256],
  [t.UInt256, 256, {type: "UInt256", value: 256}, 256],
  [t.Word8, 8, {type: "Word8", value: 8}, 8],
  [t.Word16, 16, {type: "Word16", value: 16}, 16],
  [t.Word32, 32, {type: "Word32", value: 32}, 32],
  [t.Word64, 64, {type: "Word64", value: 64}, 64],
  [t.UFix64, 64, {type: "UFix64", value: 64}, 64],
  [t.Fix64, 64, {type: "Fix64", value: 64}, 64],
  [
    t.String,
    "Go with the Flow",
    {type: "String", value: "Go with the Flow"},
    "Go with the Flow",
  ],
  [t.Character, "c", {type: "Character", value: "c"}, "c"],
  [t.Bool, true, {type: "Bool", value: true}, true],
  [t.Address, "0x1", {type: "Address", value: "0x1"}, "0x1"],
  [t.Void, null, {type: "Void"}, null],
  [t.Optional, null, {type: "Optional", value: null}, null],
  [
    t.Optional,
    t.String.asParam("test"),
    {type: "Optional", value: {type: "String", value: "test"}},
    {type: "String", value: "test"},
  ],
  [
    t.Reference,
    {address: "0x01", type: "0x01.CryptoKitty"},
    {type: "Reference", value: {address: "0x01", type: "0x01.CryptoKitty"}},
    {address: "0x01", type: "0x01.CryptoKitty"},
  ],
  [
    t.Array,
    t.String.asParam("test"),
    {type: "Array", value: [{type: "String", value: "test"}]},
    {type: "String", value: "test"},
  ],
  [
    t.Array,
    [t.String.asParam("test1"), t.String.asParam("test2")],
    {
      type: "Array",
      value: [
        {type: "String", value: "test1"},
        {type: "String", value: "test2"},
      ],
    },
    [
      {type: "String", value: "test1"},
      {type: "String", value: "test2"},
    ],
  ],
  [
    t.Dictionary,
    [
      {key: t.Int.asParam(1), value: t.String.asParam("one")},
      {key: t.Int.asParam(2), value: t.String.asParam("two")},
    ],
    {
      type: "Dictionary",
      value: [
        {key: {type: "Int", value: 1}, value: {type: "String", value: "one"}},
        {key: {type: "Int", value: 2}, value: {type: "String", value: "two"}},
      ],
    },
    [
      {key: {type: "Int", value: 1}, value: {type: "String", value: "one"}},
      {key: {type: "Int", value: 2}, value: {type: "String", value: "two"}},
    ],
  ],
  [
    t.Dictionary,
    {key: t.Int.asParam(1), value: t.String.asParam("one")},
    {
      type: "Dictionary",
      value: [
        {key: {type: "Int", value: 1}, value: {type: "String", value: "one"}},
      ],
    },
    {key: {type: "Int", value: 1}, value: {type: "String", value: "one"}},
  ],
  [
    t.Struct,
    { id: "0x01.Jeffysaur", fields: [ { name: "Jeffysaur_Name", value: t.String.asParam("Mr Jeff The Dinosaur") } ] },
    {
      type: "Struct",
      value: { id: "0x01.Jeffysaur", fields: [ { name: "Jeffysaur_Name", value: { type: "String", value: "Mr Jeff The Dinosaur" } } ] },
    },
    { id: "0x01.Jeffysaur", fields: [ { name: "Jeffysaur_Name", value: { type: "String", value: "Mr Jeff The Dinosaur" } } ] },
  ],
  [
    t.Event,
    { id: "0x01.JeffWroteSomeJS", fields: [ { name: "wasTheCodeClean?", value: t.String.asParam("absolutely") } ] },
    {
      type: "Event",
      value: { id: "0x01.JeffWroteSomeJS", fields: [ { name: "wasTheCodeClean?", value: { type: "String", value: "absolutely" } } ] },
    },
    { id: "0x01.JeffWroteSomeJS", fields: [ { name: "wasTheCodeClean?", value: { type: "String", value: "absolutely" } } ] },
  ],
  [
    t.Resource,
    { id: "0x01.Jeffysaur", fields: [ { name: "Jeffysaur_Name", value: t.String.asParam("Mr Jeff The Dinosaur") } ] },
    {
      type: "Resource",
      value: { id: "0x01.Jeffysaur", fields: [ { name: "Jeffysaur_Name", value: { type: "String", value: "Mr Jeff The Dinosaur" } } ] },
    },
    { id: "0x01.Jeffysaur", fields: [ { name: "Jeffysaur_Name", value: { type: "String", value: "Mr Jeff The Dinosaur" } } ] },
  ]
].forEach(([cast, input, asParam, asInjection]) => {
  describe(cast.label, () => {
    test(`t.${cast.label}.asParam(${input})`, () => {
      expect(cast.asParam(input)).toStrictEqual(asParam)
    })
    test(`t.${cast.label}.asInjection(${input})`, () => {
      expect(cast.asInjection(input)).toStrictEqual(asInjection)
    })
  })
})
