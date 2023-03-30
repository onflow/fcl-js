import { createRef } from 'react'
import { createSignal } from "@react-rxjs/utils"
import { bind } from "@react-rxjs/core"

export const webViewRef = createRef();

const [endpointChange$, setEndpoint] = createSignal();
const [useEndpoint, endpoint$] = bind(endpointChange$, null)

export function renderWebview(src) {
  setEndpoint(src)

  const unmount = () => {
    setEndpoint(null)
  }

  return [webViewRef, unmount]
}

export {useEndpoint}
