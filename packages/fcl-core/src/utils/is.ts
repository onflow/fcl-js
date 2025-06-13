const is =
  <T>(type: string) =>
  (d: any): d is T =>
    typeof d === type

export const isRequired = (d: any): d is NonNullable<any> => d != null
export const isObject = is<object>("object")
export const isString = is<string>("string")
export const isFunc = is<Function>("function")
export const isNumber = is<number>("number")
