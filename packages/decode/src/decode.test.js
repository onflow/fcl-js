import assert from "assert"
import {decode} from "./decode"

describe("decode", () => {
  it("returns the correct response given a json-cdc payload 1", () => {
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
                fields: [
                  {
                    name: "x",
                    value: {
                      type: "Int",
                      value: "42",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }

    const decoded = decode(payload)

    assert.deepEqual(decoded, {
      bar: {
        x: 42,
      },
    })
  })

  it("returns the correct response given a json-cdc payload 2 OPTIONAL", () => {
    const payload = {"type":"Optional","value":null}

    const decoded = decode(payload)

    assert.deepEqual(decoded, null)
  })

  it("returns the correct response given a json-cdc payload 3 OPTIONAL", () => {
    const payload = {"type":"Optional","value":{"type":"Int","value":"42"}}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 42)
  })

  it("returns the correct response given a json-cdc payload 4 VOID", () => {
    const payload = {"type":"Void"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, null)
  })

  it("returns the correct response given a json-cdc payload 5 BOOLEAN", () => {
    const payload = {"type":"Bool","value":true}

    const decoded = decode(payload)

    assert.deepEqual(decoded, true)
  })

  it("returns the correct response given a json-cdc payload 6 BOOLEAN", () => {
    const payload = {"type":"Bool","value":false}

    const decoded = decode(payload)

    assert.deepEqual(decoded, false)
  })
  
  it("returns the correct response given a json-cdc payload 7 STRING", () => {
    const payload = {"type":"String","value":""}

    const decoded = decode(payload)

    assert.deepEqual(decoded, "")
  })

  it("returns the correct response given a json-cdc payload 8 STRING", () => {
    const payload = {"type":"String","value":"foo"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, "foo")
  })

  it("returns the correct response given a json-cdc payload 9 ADDRESS", () => {
    const payload = {"type":"Address","value":"0x0102030405000000000000000000000000000000"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, "0x0102030405000000000000000000000000000000")
  })

  it("returns the correct response given a json-cdc payload 10 ADDRESS", () => {
    const payload = {"type":"Address","value":"0x0102030405000000000000000000000000000000"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, "0x0102030405000000000000000000000000000000")
  })

  it("returns the correct response given a json-cdc payload 10 INT", () => {
    const payload = {"type":"Int","value":"-42"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, -42)
  })

  it("returns the correct response given a json-cdc payload 11 INT", () => {
    const payload = {"type":"Int","value":"115792089237316195423570985008687907853269984665640564039457584007913129639945"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 115792089237316195423570985008687907853269984665640564039457584007913129639945)
  })

  it("returns the correct response given a json-cdc payload 12 INT", () => {
    const payload = {"type":"Int","value":"-57896044618658097711785492504343953926634992332820282019728792003956564819978"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, -57896044618658097711785492504343953926634992332820282019728792003956564819978)
  })

  it("returns the correct response given a json-cdc payload 13 INT", () => {
    const payload = {"type":"Int","value":"0"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 0)
  })

  it("returns the correct response given a json-cdc payload 14 INT8", () => {
    const payload = {"type":"Int8","value":"-128"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, -128)
  })

  it("returns the correct response given a json-cdc payload 15 INT16", () => {
    const payload = {"type":"Int16","value":"32767"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 32767)
  })

  it("returns the correct response given a json-cdc payload 16 INT32", () => {
    const payload = {"type":"Int32","value":"2147483647"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 2147483647)
  })

  it("returns the correct response given a json-cdc payload 17 INT64", () => {
    const payload = {"type":"Int64","value":"-9223372036854775808"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, -9223372036854775808)
  })

  it("returns the correct response given a json-cdc payload 18 INT128", () => {
    const payload = {"type":"Int128","value":"-170141183460469231731687303715884105727"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, -170141183460469231731687303715884105727)
  })

  it("returns the correct response given a json-cdc payload 19 INT256", () => {
    const payload = {"type":"Int256","value":"57896044618658097711785492504343953926634992332820282019728792003956564819967"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 57896044618658097711785492504343953926634992332820282019728792003956564819967)
  })

  it("returns the correct response given a json-cdc payload 20 UINT", () => {
    const payload = {"type":"UInt","value":"115792089237316195423570985008687907853269984665640564039457584007913129639945"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 115792089237316195423570985008687907853269984665640564039457584007913129639945)
  })

  it("returns the correct response given a json-cdc payload 21 UINT8", () => {
    const payload = {"type":"UInt8","value":"255"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 255)
  })

  it("returns the correct response given a json-cdc payload 22 UINT16", () => {
    const payload = {"type":"UInt16","value":"65535"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 65535)
  })

  it("returns the correct response given a json-cdc payload 23 UINT32", () => {
    const payload = {"type":"UInt32","value":"4294967295"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 4294967295)
  })

  it("returns the correct response given a json-cdc payload 24 UINT64", () => {
    const payload = {"type":"UInt64","value":"18446744073709551615"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 18446744073709551615)
  })

  it("returns the correct response given a json-cdc payload 25 UINT128", () => {
    const payload = {"type":"UInt128","value":"340282366920938463463374607431768211455"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 340282366920938463463374607431768211455)
  })

  it("returns the correct response given a json-cdc payload 26 UINT256", () => {
    const payload = {"type":"UInt256","value":"115792089237316195423570985008687907853269984665640564039457584007913129639935"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 115792089237316195423570985008687907853269984665640564039457584007913129639935)
  })

  it("returns the correct response given a json-cdc payload 27 WORD8", () => {
    const payload = {"type":"Word8","value":"255"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 255)
  })

  it("returns the correct response given a json-cdc payload 28 WORD16", () => {
    const payload = {"type":"Word16","value":"65535"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 65535)
  })

  it("returns the correct response given a json-cdc payload 29 WORD32", () => {
    const payload = {"type":"Word32","value":"4294967295"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 4294967295)
  })

  it("returns the correct response given a json-cdc payload 30 WORD64", () => {
    const payload = {"type":"Word64","value":"18446744073709551615"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 18446744073709551615)
  })

  it("returns the correct response given a json-cdc payload 31 FIX64", () => {
    const payload = {"type":"Fix64","value":"789.00123010"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 789.00123010)
  })

  it("returns the correct response given a json-cdc payload 32 FIX64", () => {
    const payload = {"type":"Fix64","value":"-12345.00678900"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, -12345.00678900)
  })

  it("returns the correct response given a json-cdc payload 33 UFIX64", () => {
    const payload = {"type":"UFix64","value":"789.00123010"}

    const decoded = decode(payload)

    assert.deepEqual(decoded, 789.00123010)
  })

  it("returns the correct response given a json-cdc payload 34 ARRAY", () => {
    const payload = {"type":"Array","value":[{"type":"Int","value":"1"},{"type":"Int","value":"2"},{"type":"Int","value":"3"}]}

    const decoded = decode(payload)

    assert.deepEqual(decoded, [1,2,3])
  })

  it("returns the correct response given a json-cdc payload 35 ARRAY", () => {
    const payload = {"type":"Array","value":[{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"1"}}]}},{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"2"}}]}},{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"3"}}]}}]}

    const decoded = decode(payload)

    assert.deepEqual(decoded, [{bar:1},{bar:2},{bar:3}])
  })

  it("returns the correct response given a json-cdc payload 36 DICTIONARY", () => {
    const payload = {"type":"Dictionary","value":[{"key":{"type":"String","value":"a"},"value":{"type":"Int","value":"1"}},{"key":{"type":"String","value":"b"},"value":{"type":"Int","value":"2"}},{"key":{"type":"String","value":"c"},"value":{"type":"Int","value":"3"}}]}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {a:1,b:2,c:3})
  })

  it("returns the correct response given a json-cdc payload 37 DICTIONARY", () => {
    const payload = {"type":"Dictionary","value":[{"key":{"type":"String","value":"a"},"value":{"type":"Dictionary","value":[{"key":{"type":"String","value":"1"},"value":{"type":"Int","value":"1"}}]}},{"key":{"type":"String","value":"b"},"value":{"type":"Dictionary","value":[{"key":{"type":"String","value":"2"},"value":{"type":"Int","value":"2"}}]}},{"key":{"type":"String","value":"c"},"value":{"type":"Dictionary","value":[{"key":{"type":"String","value":"3"},"value":{"type":"Int","value":"3"}}]}}]}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {a: {1:1},b: {2:2},c: {3:3}})
  })

  it("returns the correct response given a json-cdc payload 38 DICTIONARY", () => {
    const payload = {"type":"Dictionary","value":[{"key":{"type":"String","value":"a"},"value":{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"1"}}]}}},{"key":{"type":"String","value":"b"},"value":{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"2"}}]}}},{"key":{"type":"String","value":"c"},"value":{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"3"}}]}}}]}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {"a": {"bar": 1}, "b": {"bar": 2}, "c": {"bar": 3}})
  })

  it("returns the correct response given a json-cdc payload 39 RESOURCE", () => {
    const payload = {"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"42"}}]}}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {"bar": 42})
  })

  it("returns the correct response given a json-cdc payload 40 RESOURCE", () => {
    const payload = {"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Resource","value":{"id":"test.Bar","fields":[{"name":"x","value":{"type":"Int","value":"42"}}]}}}]}}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {"bar": { x: 42 }})
  })

  it("returns the correct response given a json-cdc payload 41 STRUCT", () => {
    const payload = {"type":"Struct","value":{"id":"test.FooStruct","fields":[{"name":"a","value":{"type":"Int","value":"1"}},{"name":"b","value":{"type":"String","value":"foo"}}]}}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {"a": 1, b: "foo"})
  })

  it("returns the correct response given a json-cdc payload 42 STRUCT", () => {
    const payload = {"type":"Struct","value":{"id":"test.FooStruct","fields":[{"name":"a","value":{"type":"String","value":"foo"}},{"name":"b","value":{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"42"}}]}}}]}}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {"a": "foo", b: { bar: 42 }}) 
  })

  it("returns the correct response given a json-cdc payload 43 STRUCT", () => {
    const payload = {"type":"Struct","value":{"id":"test.FooStruct","fields":[{"name":"a","value":{"type":"String","value":"foo"}},{"name":"b","value":{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"42"}}]}}}]}}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {"a": "foo", b: { bar: 42 }}) 
  })

  it("returns the correct response given a json-cdc payload 44 EVENT", () => {
    const payload = {"type":"Event","value":{"id":"test.FooEvent","fields":[{"name":"a","value":{"type":"Int","value":"1"}},{"name":"b","value":{"type":"String","value":"foo"}}]}}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {"a": 1, b: "foo"}) 
  })

  it("returns the correct response given a json-cdc payload 44 EVENT", () => {
    const payload = {"type":"Event","value":{"id":"test.FooEvent","fields":[{"name":"a","value":{"type":"String","value":"foo"}},{"name":"b","value":{"type":"Resource","value":{"id":"test.Foo","fields":[{"name":"bar","value":{"type":"Int","value":"42"}}]}}}]}}

    const decoded = decode(payload)

    assert.deepEqual(decoded, {"a": "foo", "b": {"bar": 42}}) 
  })
})
