import {config} from "../sdk"

const noop = () => {}
export const overload = async (opts = {}, callback = noop) => {
  return new Promise(async (resolve, reject) => {
    let old = await Promise.all(
      Object.keys(opts).map(async k => [k, await config().get(k)])
    )
    try {
      await config(opts)
      var result = await callback(opts)
      await config(Object.fromEntries(old))
      resolve(result)
    } catch (error) {
      await config(Object.fromEntries(old))
      reject(error)
    }
  })
}
