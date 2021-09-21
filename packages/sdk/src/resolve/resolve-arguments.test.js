import {
  resolveArguments
} from "../sdk.js"

describe("resolveArguments", () => {
  const argID = "28948a11n4"
  const argObj = {
    type: "Address",
    value: "0xf8d6e0586b0a20c7"
  }
  const tag = "SCRIPT"
  const kind = "ARGUMENT"
  const tempId = argID
  
  test("should resolve synchronous arguments", async () => {
    const ix = {
      tag,
      arguments: {
        [argID]: {
          asArgument: argObj,
          kind,
          resolve: undefined,
          tempId,
          value: argObj.value,
          xform: {
            label: "Address",
            asArgument: () => argObj
          }
        }
      }
    }

    const res = await resolveArguments(ix)
    expect(res.arguments[argID].asArgument).toEqual(argObj)
    expect(res.arguments[argID].value).toEqual(argObj.value)
  })

  test("should resolve asynchronous arguments", async () => {
    const ix = {
      tag,
      arguments: {
        [argID]: {
          asArgument: argObj,
          kind,
          resolve: () => Promise.resolve(argObj),
          tempId,
          value: null,
          xform: {
            label: "Address",
            asArgument: () => argObj
          }
        }
      }
    }

    const res = await resolveArguments(ix)
    expect(res.arguments[argID].asArgument).toEqual(argObj)
    expect(res.arguments[argID].value).toEqual(argObj.value)
  })
})
  