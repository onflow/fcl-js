import {browser} from "./utils/browser"

export function execDeeplinkRPC({service}) {
  return new Promise((resolve, reject) => {

    browser(service, {
      onClose() {
        reject(`Declined: Externally Halted`)
      },
    })
  })
}
