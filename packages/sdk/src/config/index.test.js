import {config, clearConfig} from "./"

const idle = () => new Promise(resolve => setTimeout(resolve), 0)

describe("config()", () => {
  clearConfig()

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

  test("all", async () => {
    expect(await config().all()).toEqual({
      "config.test.foo.bar": "bar",
      "config.test.foo.baz": "baz",
      "config.test.init": "rawr",
      "config.test.t": "tt",
      "config.test.wat.bar": "foo",
      "config.test.x": "x",
      "config.test.y": "yy",
    })

    await clearConfig()
  })

  test("empty", async () => {
    expect(await config().all()).toEqual({})
  })

  describe("sans ()", () => {
    afterEach(clearConfig)

    test("config(data)", async () => {
      const data = {
        foo: "bar",
        baz: "buz",
      }

      config(data)

      expect(await config.all()).toEqual(data)
    })

    test("config.put config.get", async () => {
      config.put("foo", "bar")
      expect(await config.get("foo")).toBe("bar")
    })
  })

  describe("overload", () => {
    afterEach(clearConfig)

    test("overload", async () => {
      const PRE = {
        yes: "yes",
        foo: "bar",
        bar: "baz",
      }

      const POST = {
        foo: "bar!!",
        bar: "baz!!",
        omg: "omg!!",
      }

      config(PRE)
      expect(await config.all()).toEqual(PRE)
      const ret = await config.overload(POST, async d => {
        expect(await config.all()).toEqual({...PRE, ...POST})
        return "WOOT WOOT"
      })
      expect(ret).toBe("WOOT WOOT")
      expect(await config.all()).toEqual(PRE)
    })
  })

  describe("first", () => {
    const A = "A",
      B = null,
      C = 0,
      D = {}
    const FALLBACK = "FALLBACK"

    beforeEach(() => config({A: A, B: B, C: C, D: D}))
    afterEach(clearConfig)

    const examples = [
      [FALLBACK],
      [A, ["A"]],
      [FALLBACK, ["B"]],
      [C, ["C"]],
      [D, ["D"]],
      [A, ["MISSING", "A"]],
      [FALLBACK, ["MISSING", "B"]],
    ]

    for (let [i, [want, from]] of examples.entries()) {
      test(`Example ${i}: ${from} -> ${want}`, async () => {
        expect(await config.first(from, FALLBACK)).toBe(want)
      })
    }
  })
})
