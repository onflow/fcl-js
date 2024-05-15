import {Service} from "@onflow/typedefs"
import {
  WalletConnectModal,
  WalletConnectModalConfig,
} from "@walletconnect/modal"
import {
  CoreUtil,
  ModalCtrl,
  OptionsCtrl,
  RouterCtrl,
  WalletData,
} from "@walletconnect/modal-core"

export class FCLWalletConnectModal extends WalletConnectModal {
  public constructor(config: WalletConnectModalConfig) {
    super(config)
  }

  // Helper function to directly open the QR code modal
  // This allows us to skip the "connect" modal and go straight to the QR code
  // If the user has already selected their wallet
  public openQr = async (options: {uri: string; service: Service}) => {
    ModalCtrl.state.open = true

    return new Promise<void>(resolve => {
      const {isUiLoaded, isDataLoaded} = OptionsCtrl.state
      CoreUtil.removeWalletConnectDeepLink()

      OptionsCtrl.setWalletConnectUri(options?.uri)
      //OptionsCtrl.setChains(options?.chains)
      RouterCtrl.reset("MobileQrcodeConnecting")
      RouterCtrl.push("MobileQrcodeConnecting", {
        uri: options?.uri,
        service: options?.service,
      })

      // Open modal if essential async data is ready
      if (isUiLoaded && isDataLoaded) {
        ModalCtrl.state.open = true
        resolve()
      }
      // Otherwise (slow network) re-attempt open checks
      else {
        const interval = setInterval(() => {
          const opts = OptionsCtrl.state
          if (opts.isUiLoaded && opts.isDataLoaded) {
            clearInterval(interval)
            ModalCtrl.state.open = true
            resolve()
          }
        }, 200)
      }
    })
  }
}
