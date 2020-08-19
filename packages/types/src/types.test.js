import * as t from "./types.js"
;[
  [t.Identity, 0, 0, 0],
  [t.Identity, "a", "a", "a"],
  [t.Identity, null, null, null],
  [t.Int, 1, {type: "Int", value: "1"}, 1],
  [t.UInt, 1, {type: "UInt", value: "1"}, 1],
  [t.Int8, 8, {type: "Int8", value: "8"}, 8],
  [t.UInt8, 8, {type: "UInt8", value: "8"}, 8],
  [t.Int16, 16, {type: "Int16", value: "16"}, 16],
  [t.UInt16, 16, {type: "UInt16", value: "16"}, 16],
  [t.Int32, 32, {type: "Int32", value: "32"}, 32],
  [t.UInt32, 32, {type: "UInt32", value: "32"}, 32],
  [t.Int64, 64, {type: "Int64", value: "64"}, 64],
  [t.UInt64, 64, {type: "UInt64", value: "64"}, 64],
  [t.Int128, 128, {type: "Int128", value: "128"}, 128],
  [t.UInt128, 128, {type: "UInt128", value: "128"}, 128],
  [t.Int256, 256, {type: "Int256", value: "256"}, 256],
  [t.UInt256, 256, {type: "UInt256", value: "256"}, 256],
  [t.Word8, 8, {type: "Word8", value: "8"}, 8],
  [t.Word16, 16, {type: "Word16", value: "16"}, 16],
  [t.Word32, 32, {type: "Word32", value: "32"}, 32],
  [t.Word64, 64, {type: "Word64", value: "64"}, 64],
  [t.UFix64, "64", {type: "UFix64", value: "64"}, "64"],
  [t.Fix64, "64", {type: "Fix64", value: "64"}, "64"],
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
  [t.Optional(t.String), null, {type: "Optional", value: null}, null],
  [
    t.Optional(t.String),
    "test",
    {type: "Optional", value: {type: "String", value: "test"}},
    "test",
  ],
  [
    t.Reference,
    {address: "0x01", type: "0x01.CryptoKitty"},
    {type: "Reference", value: {address: "0x01", type: "0x01.CryptoKitty"}},
    {address: "0x01", type: "0x01.CryptoKitty"},
  ],
  [
    t.Array(t.String),
    ["test"],
    {type: "Array", value: [{type: "String", value: "test"}]},
    ["test"],
  ],
  [
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
  ],
  [
    t.Dictionary([
      {key: t.Int, value: t.String},
      {key: t.Int, value: t.String},
    ]),
    [
      {key: 1, value: "one"},
      {key: 2, value: "two"},
    ],
    {
      type: "Dictionary",
      value: [
        {key: {type: "Int", value: "1"}, value: {type: "String", value: "one"}},
        {key: {type: "Int", value: "2"}, value: {type: "String", value: "two"}},
      ],
    },
    [
      {key: 1, value: "one"},
      {key: 2, value: "two"},
    ],
  ],
  [
    t.Dictionary({key: t.Int, value: t.String}),
    {key: 1, value: "one"},
    {
      type: "Dictionary",
      value: [
        {key: {type: "Int", value: "1"}, value: {type: "String", value: "one"}},
      ],
    },
    {key: 1, value: "one"},
  ],
  [
    t.Struct("0x01.Jeffysaur", [{value: t.String}]),
    {
      fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}],
    },
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
    {
      fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}],
    },
  ],
  [
    t.Event("0x01.JeffWroteSomeJS", [{value: t.String}]),
    {
      fields: [{name: "wasTheCodeClean?", value: "absolutely"}],
    },
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
    {
      fields: [{name: "wasTheCodeClean?", value: "absolutely"}],
    },
  ],
  [
    t.Resource("0x01.Jeffysaur", [{value: t.String}]),
    {
      fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}],
    },
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
    {
      fields: [{name: "Jeffysaur_Name", value: "Mr Jeff The Dinosaur"}],
    },
  ],
].forEach(([cast, input, asArgument, asInjection]) => {
  describe(cast.label, () => {
    test(`t.${cast.label}.asArgument(${input})`, () => {
      expect(cast.asArgument(input)).toStrictEqual(asArgument)
    })
    test(`t.${cast.label}.asInjection(${input})`, () => {
      expect(cast.asInjection(input)).toStrictEqual(asInjection)
    })
  })
})
