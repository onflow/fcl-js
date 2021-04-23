export {createVoucher} from "./create-voucher.js"
export {deprecate} from "./deprecate.js"

export const isNumber = d => typeof d === "number"
export const isString = d => typeof d === "string"
export const isArray = d => Array.isArray(d)
export const isObj = d => d !== null && typeof d === "object"
export const isNull = d => d == null
export const isFn = d => typeof d === "function"
