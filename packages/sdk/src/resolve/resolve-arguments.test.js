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
          asArgument: null,
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
  })

  test("should resolve asynchronous arguments", async () => {
    const ix = {
      tag,
      arguments: {
        [argID]: {
          asArgument: null,
          kind,
          resolve: jest.fn().mockResolvedValue({
            xform: {
              asArgument: () => argObj
            }
          }),
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
    expect(res.arguments[argID].resolve).toHaveBeenCalled()
    expect(res.arguments[argID].asArgument).toEqual(argObj)
  })
})
  