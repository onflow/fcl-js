import {send} from "./index"

test("injection as option", async () => {
  const buildFunction = jest.fn(async (ix) => ix)
  const resolveFunction = jest.fn(async (ix) => ix)
  const sendFunction = jest.fn(async (ix) => ix)

  await send([buildFunction], {
    resolve: resolveFunction,
    send: sendFunction,
  })

  expect(buildFunction).toHaveBeenCalledTimes(1)
  expect(resolveFunction).toHaveBeenCalledTimes(1)
  expect(sendFunction).toHaveBeenCalledTimes(1)

  const ix = buildFunction.mock.calls[0][0]

  expect(ix).toEqual(await resolveFunction.mock.calls[0][0])
  expect(ix).toEqual(await sendFunction.mock.calls[0][0])
})
