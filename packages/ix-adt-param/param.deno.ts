export interface Param {
  kind: string
  tempId?: string
  key?: string
  value: any
  xform: object
}

const PARAM = `{
  "kind":"PARAM",
  "tempId":null,
  "key":null,
  "value":null,
  "xform":null,
  "resolve": null
}`

export function param(): Param {
  return JSON.parse(PARAM)
}
