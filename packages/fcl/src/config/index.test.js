import {config} from "./"

const idle = () => new Promise(resolve => setTimeout(resolve), 0)

describe("config", () => {
  const $ = config()
  $.put("config.test.t", "t")
  $.put("config.test.z", "z")
  $.put("config.test.foo.bar", "bar")
  $.put("config.test.foo.baz", "baz")
  $.put("config.test.wat.bar", "foo")

  test("get", async () => {
    expect(await $.get("config.test.foo.bar")).toBe("bar")
  })

  test("get with fallback", async () => {
    expect(await $.get("config.test.not.a.thing", "fallback")).toBe("fallback")
  })

  test("update", async () => {
    $.update("config.test.t", v => v + v)
    expect(await $.get("config.test.t")).toBe("tt")
  })

  test("delete", async () => {
    $.delete("config.test.z")
    expect(await $.get("config.test.z")).toBe(undefined)
  })

  test("where", async () => {
    expect(await $.where(/^config.test.foo/)).toEqual({
      "config.test.foo.bar": "bar",
      "config.test.foo.baz": "baz",
    })
  })

  test("subscribe", async () => {
    const fn1 = jest.fn()
    const unsub = $.subscribe(fn1)
    await idle()

    $.put("config.test.y", "y")
    $.put("config.test.x", "x")

    await idle()
    unsub()
    await idle()

    $.update("config.test.y", v => v + v)

    await idle()

    expect(fn1).toHaveBeenCalledTimes(3)
  })
})
