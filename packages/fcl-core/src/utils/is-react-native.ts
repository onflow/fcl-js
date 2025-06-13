let _isReactNative: boolean = false

export function isReactNative(): boolean {
  return _isReactNative
}

export function setIsReactNative(value: boolean): void {
  _isReactNative = value
}
