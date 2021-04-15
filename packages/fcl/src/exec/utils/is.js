const is = type => d => typeof d === type

export const isRequired = d => d != null
export const isObject = is("object")
export const isString = is("string")
export const isFunc = is("function")
export const isNumber = is("number")
