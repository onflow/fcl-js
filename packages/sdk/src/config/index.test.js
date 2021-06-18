import {config} from "./"

const idle = () => new Promise(resolve => setTimeout(resolve), 0)

describe("config", () => {
  config({
    "config.test.init": "rawr",
  })

  config()
    .put("config.test.t", "t")
    .put("config.test.z", "z")
    .put("config.test.foo.bar", "bar")
    .put("config.test.foo.baz", "baz")
    .put("config.test.wat.bar", "foo")

  test("get", async () => {
    expect(await config().get("config.test.foo.bar")).toBe("bar")
    expect(await config().get("config.test.init")).toBe("rawr")
  })

  test("get with fallback", async () => {
    expect(await config().get("config.test.not.a.thing", "fallback")).toBe(
      "fallback"
    )
  })

  test("update", async () => {
    config().update("config.test.t", v => v + v)
    expect(await config().get("config.test.t")).toBe("tt")
  })

  test("delete", async () => {
    config().delete("config.test.z")
    expect(await config().get("config.test.z")).toBe(undefined)
  })

  test("where", async () => {
    expect(await config().where(/^config.test.foo/)).toEqual({
      "config.test.foo.bar": "bar",
      "config.test.foo.baz": "baz",
    })
  })

  test("subscribe", async () => {
    const fn1 = jest.fn()
    const unsub = config().subscribe(fn1)
    await idle()

    config().put("config.test.y", "y").put("config.test.x", "x")

    await idle()
    unsub()
    await idle()

    config().update("config.test.y", v => v + v)

    await idle()

    expect(fn1).toHaveBeenCalledTimes(3)
  })
})
