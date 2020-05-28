export interface Param {
  kind: string
  tempId?: string
  key?: string
  value: any
  xform: object
}

export function param(): Param
