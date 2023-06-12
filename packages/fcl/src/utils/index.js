export {getChainId} from "./get-chain-id"
export {watchForChainIdChanges} from "./chain-id-watcher"

export function isAndroid() {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  )
}

export function isSmallIOS() {
  return (
    typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent)
  )
}

export function isLargeIOS() {
  return typeof navigator !== "undefined" && /iPad/.test(navigator.userAgent)
}

export function isIOS() {
  return isSmallIOS() || isLargeIOS()
}

export function isMobile() {
  return isAndroid() || isIOS()
}


/**
 * Gets the current environment that the code is running in.
 * 
 * @returns {"ReactNative" | "Web" | "NodeJS"}
 */
export function getEnvironment() {
  if (typeof document !== 'undefined') {
    return "Web"
  }
  else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return "ReactNative"
  }
  else {
    return "NodeJS"
  }
}