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
          resolveArgument: undefined,
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
          resolve: jest.fn(),
          resolveArgument: jest.fn().mockResolvedValue({
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
    expect(res.arguments[argID].resolve).not.toHaveBeenCalled()
    expect(res.arguments[argID].resolveArgument).toHaveBeenCalled()
    expect(res.arguments[argID].asArgument).toEqual(argObj)
  })

  test("should resolve nested asynchronous arguments", async () => {

    const resolveTwo = jest.fn().mockResolvedValue({
      xform: {
        asArgument: () => argObj
      }
    })

    const ix = {
      tag,
      arguments: {
        [argID]: {
          asArgument: null,
          kind,
          resolve: undefined,
          resolveArgument: jest.fn().mockResolvedValue({
            xform: {
              asArgument: () => argObj
            },
            resolveArgument: resolveTwo
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
    expect(res.arguments[argID].resolveArgument).toHaveBeenCalled()
    expect(resolveTwo).toHaveBeenCalled()
    expect(res.arguments[argID].asArgument).toEqual(argObj)
  })

  test("should throw an error if resolve recursion exceeds depth limit", async () => {
    const ix = {
      tag,
      arguments: {
        [argID]: {
          asArgument: null,
          kind,
          resolve: undefined,
          resolveArgument: jest.fn().mockResolvedValue({
            tempId: "1",
            xform: {
              asArgument: () => argObj
            },
            resolveArgument: jest.fn().mockResolvedValue({
              tempId: "2",
              xform: {
                asArgument: () => argObj
              },
              resolveArgument: jest.fn().mockResolvedValue({
                tempId: "3",
                xform: {
                  asArgument: () => argObj
                }
              })
            })
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

    await expect(resolveArguments(ix))
      .rejects
      .toThrow();
  })
})
  