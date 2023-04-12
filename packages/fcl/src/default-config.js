import {config} from "@onflow/config"
import {setChainIdDefault} from "./utils/getChainId"

const getDefaultConfig = () => {
  try {
    const {getDefaultConfig: getDefaultConfigForReactNative} = require("@onflow/util-react-native")
    if (getDefaultConfigForReactNative) {
      return getDefaultConfigForReactNative()
    }
  } catch {
  }

  const {getDefaultConfig: getDefaultConfigForWeb} = require("@onflow/util-web/util-web")
  return getDefaultConfigForWeb()
}

config(getDefaultConfig())

// this is an async function but we can't await bc it's run at top level.
// NOT guaranteed that flow.network.default is set after this call (or at startup)
setChainIdDefault()

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}
