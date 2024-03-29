import {template, interleave} from "./template"

describe("interleave", () => {
  ;[
    [[], [], []],
    [[1], [], [1]],
    [[], [1], []],
    [[1], [2], [1, 2]],
    [
      [1, 2, 3],
      [4, 5, 6],
      [1, 4, 2, 5, 3, 6],
    ],
    [
      [1, 2, 3],
      [4, 5],
      [1, 4, 2, 5, 3],
    ],
  ].forEach(([a, b, c]) => {
    test(`interleave([${a}], [${b}]) -> [${c}]`, () => {
      expect(interleave(a, b)).toStrictEqual(c)
    })
  })
})

const _ = (msg: string, a: unknown, b?: unknown) => {
  if (b == null) {
    test(msg, () => expect(a).toMatchSnapshot())
  } else {
    test(msg, () => expect(a).toBe(b))
  }
}
const t = <T>(v: T) => typeof v

describe("template", () => {
  describe("input type vs output type", () => {
    _("template`` -> function", t(template``))
    _("t71(``) -> function", t(template("words")))
    _("template(template``) -> function", t(template(template``)))
  })

  describe("no interop", () => {
    _("template`abc`() -> 'abc'", template`abc`())
    _("template('abc')() -> 'abc'", template("abc")())
    _("template(template`abc`)() -> 'abc'", template(template`abc`)())
  })

  describe("only interop", () => {
    _("template`${'abc'}`() -> 'abc'", template`${"abc"}`())
    _("template(template`${'abc'}`)() -> 'abc'", template(template`${"abc"}`)())
  })

  describe("interop function", () => {
    const o = {a: "abc"}
    _("template`${o=>o.a}`(o) -> 'abc'", template`${(_o: typeof o) => _o.a}`(o))
    _(
      "template(template`${o=>o.a}`)(o) -> 'abc'",
      template(template`${(_o: typeof o) => _o.a}`)(o)
    )
  })

  describe("interop more template", () => {
    const o = {a: "abc"}
    _(
      "template`x${template`y${o=>o.a}`}`(o) => 'xyabc'",
      template`x${template`y${(_o: typeof o) => _o.a}`}`(o)
    )
    _(
      "template`x${template`y${template`z${o=>o.a}`}`}`(o) => 'xyabc'",
      template`x${template`y${template`z${(_o: typeof o) => _o.a}`}`}`(o)
    )
    _(
      "template(template`x${template`y${(_o: typeof o) => _o.a}`}`)(o) -> 'xyabc'",
      template(template`x${template`y${(_o: typeof o) => _o.a}`}`)(o)
    )
  })

  describe("interop nested functions", () => {
    const fn = () => () => () => () => () => (f: typeof o) => f.a
    const o = {a: "abc"}
    _("template`${fn}`(o) -> 'abc'", template`${fn}`(o))
  })

  describe("template takes a string", () => {
    const str = "woot woot im a boot"
    _("template(str)() -> str", template(str)(), str)
  })

  describe("object can have non string values", () => {
    const data = {a: 1, b: NaN, c: undefined, d: null, e: false, f: true}
    const tx = template`a:${(o: typeof data) => o.a}|b:${(o: typeof data) =>
      o.b}|c:${(o: typeof data) => o.c}|d:${(o: typeof data) => o.d}|e:${(
      o: typeof data
    ) => o.e}|f:${(o: typeof data) => o.f}`
    _("template(data)", tx(data), "a:1|b:NaN|c:undefined|d:null|e:false|f:true")
  })
})
