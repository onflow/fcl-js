// This is a workaround for an ongoing issue with URL in React Native
// It does not parse the URL correctly and appends trailing slashes
// See: https://github.com/facebook/react-native/issues/24428
// See: https://github.com/facebook/react-native/issues/24428

// The React Native team is aware of this issue but does not plan to fix it
// since it could break existing apps, even though this is out of spec
// See whatwg implementation: https://github.com/jsdom/whatwg-url/blob/master/lib/URL-impl.js#L6-L34
// See react-native implementation: https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Blob/URL.js#L144-L146

// This is not polyfilled globally because it could break other libraries or the user's code
import {isReactNative} from "./is-react-native"

const _URL = globalThis.URL
export class URL extends _URL {
  constructor(url, base, ...args) {
    super(url, base, ...args)

    // Extra check if in React Native
    if (!isReactNative()) {
      return
    }

    // Fix trailing slash issue
    if (this._url && !url.endsWith("/") && this._url.endsWith("/")) {
      this._url = this._url.slice(0, -1)
    }
  }
}
