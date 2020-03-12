import assert from "assert"
import {decode} from "./decode"

describe("decode", () => {
  it("returns the correct reponse given a json-cdc payload", () => {
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
})
