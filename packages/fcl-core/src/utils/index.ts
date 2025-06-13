export {getChainId} from "./chain-id/get-chain-id"
export {watchForChainIdChanges} from "./chain-id/chain-id-watcher"

export function isAndroid(): boolean {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  )
}

export function isSmallIOS(): boolean {
  return (
    typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent)
  )
}

export function isLargeIOS(): boolean {
  return typeof navigator !== "undefined" && /iPad/.test(navigator.userAgent)
}

export function isIOS(): boolean {
  return isSmallIOS() || isLargeIOS()
}

export function isMobile(): boolean {
  return isAndroid() || isIOS()
}
