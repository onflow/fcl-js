const PARAM = `{
  "kind":"PARAM",
  "tempId":null,
  "key":null,
  "value":null,
  "xform":null,
  "resolve": null
}`

exports.param = function param() {
  return JSON.parse(PARAM)
}
