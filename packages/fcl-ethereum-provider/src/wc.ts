import {
  EthereumProvider,
  EthereumProviderOptions,
  OPTIONAL_EVENTS,
  OPTIONAL_METHODS,
  REQUIRED_EVENTS,
  REQUIRED_METHODS,
} from "@walletconnect/ethereum-provider"
import {
  NamespaceConfig,
  UniversalProvider,
} from "@walletconnect/universal-provider"
import {SessionTypes} from "@walletconnect/types"
import {FLOW_CHAINS, FlowNetwork} from "./constants"
import {formatChainId} from "./util/eth"
import {getAccountsFromNamespaces} from "@walletconnect/utils"
import {FLOW_METHODS} from "@onflow/fcl-wc"
import * as fcl from "@onflow/fcl"
import {Service} from "@onflow/typedefs"

const BASE_WC_SERVICE = (
  externalProvider: InstanceType<typeof UniversalProvider>
) =>
  ({
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "authn",
    method: "WC/RPC",
    uid: "https://walletconnect.com",
    endpoint: "flow_authn",
    optIn: true,
    provider: {
      address: null,
      name: "WalletConnect",
      icon: "https://avatars.githubusercontent.com/u/37784886",
      description: "WalletConnect Base Service",
      website: "https://walletconnect.com",
      color: null,
      supportEmail: null,
    },
    params: {
      externalProvider,
    },
  }) as unknown as Service

export class ExtendedEthereumProvider extends EthereumProvider {
  static async init(
    opts: EthereumProviderOptions
  ): Promise<ExtendedEthereumProvider> {
    const provider = new ExtendedEthereumProvider()

    // Bind FCL user authentication to the UniversalProvider
    const fclUser = fcl.currentUser()

    await provider.initialize(opts)
    const snapshot = await fclUser.snapshot()
    const authnService = snapshot?.services.find(
      service => service.type === "authn"
    )
    const externalProvider = authnService?.params?.externalProvider as any
    const externalProviderTopic =
      typeof externalProvider === "string"
        ? externalProvider
        : externalProvider?.session?.topic
    if (
      provider.signer.session &&
      (!authnService || externalProviderTopic === provider.signer.session.topic)
    ) {
      await fclUser.authenticate({
        service: BASE_WC_SERVICE(provider.signer),
      })
    } else {
      await fclUser.unauthenticate()
    }

    provider.on("connect", async () => {
      await fclUser
        .authenticate({service: BASE_WC_SERVICE(provider.signer)})
        .catch(console.error)
    })

    provider.on("disconnect", async () => {
      await fclUser.unauthenticate()
    })

    return provider
  }
  // TODO: remove
  protected async initialize(opts: EthereumProviderOptions): Promise<void> {
    await super.initialize(opts)
  }
  async connect(
    opts?: Parameters<InstanceType<typeof EthereumProvider>["connect"]>[0]
  ) {
    console.log("HEY")
    if (!this.signer.client) {
      throw new Error("Provider not initialized. Call init() first")
    }

    this.loadConnectOpts(opts)
    const {required, optional} = buildNamespaces(FlowNetwork.TESTNET)
    try {
      const session = await new Promise<SessionTypes.Struct | undefined>(
        async (resolve, reject) => {
          if (this.rpc.showQrModal) {
            this.modal?.subscribeModal((state: {open: boolean}) => {
              // the modal was closed so reject the promise
              if (!state.open && !this.signer.session) {
                this.signer.abortPairingAttempt()
                reject(new Error("Connection request reset. Please try again."))
              }
            })
          }
          await this.signer
            .connect({
              namespaces: required,
              optionalNamespaces: optional,
              pairingTopic: opts?.pairingTopic,
            })
            .then((session?: SessionTypes.Struct) => {
              console.log("session", session)
              resolve(session)
            })
            .catch((error: Error) => {
              reject(new Error(error.message))
            })
        }
      )
      if (!session) return

      const accounts = getAccountsFromNamespaces(session.namespaces, [
        this.namespace,
      ])
      // if no required chains are set, use the approved accounts to fetch chainIds
      this.setChainIds(this.rpc.chains.length ? this.rpc.chains : accounts)
      this.setAccounts(accounts)
      this.events.emit("connect", {chainId: formatChainId(this.chainId)})
    } catch (error) {
      this.signer.logger.error(error)
      throw error
    } finally {
      if (this.modal) this.modal.closeModal()
    }
  }

  async disconnect() {
    const fclUser = fcl.currentUser()
    fclUser.unauthenticate()
    return await super.disconnect()
  }
}

function buildNamespaces(network: FlowNetwork): {
  required: NamespaceConfig
  optional: NamespaceConfig
} {
  const {eip155ChainId} = FLOW_CHAINS[network]

  return {
    required: {
      eip155: {
        methods: REQUIRED_METHODS,
        chains: [`eip155:${eip155ChainId}`],
        events: REQUIRED_EVENTS,
      },
    },
    optional: {
      eip155: {
        methods: OPTIONAL_METHODS,
        chains: [`eip155:${eip155ChainId}`],
        events: OPTIONAL_EVENTS,
      },
      flow: {
        methods: Object.values(FLOW_METHODS),
        events: ["chainChanged", "accountsChanged"],
        chains: [`flow:${network}`],
      },
    },
  }
}
