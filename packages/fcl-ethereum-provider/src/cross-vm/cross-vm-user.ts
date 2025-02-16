/*
This is like Wagmi for cross-VM wallet connections.
It's designed to be a generic interface for connecting to wallets across VMs.

Part of this entials compatibility with VM-specific tooling.
- E.g. FCL <-> Flow Cadence VM
- E.g. Wagmi <-> Flow EVM

This generic interface allows:
1. "Cross VM Connectors" to define multi-VM authentication schemes.
1. "Cross VM Users" to bind multiple connectors together.

"Cross VM Users" will include providers for each authenticated VM.
*/

import {BehaviorSubject} from "../util/observable"

type CrossVmSession<ProviderTypes extends {}> = {
  readonly providers: Partial<ProviderTypes>
}

export type CrossVmConnector<ProviderTypes extends {}> = {
  readonly uid: string

  connect(parameters?: {
    // TODO: chainId?
    isReconnecting?: boolean | undefined
  }): Promise<CrossVmSession<Partial<ProviderTypes>>>
  disconnect(): Promise<void>
  getSession(
    parameters?: {chainId?: number | undefined} | undefined
  ): Promise<CrossVmSession<ProviderTypes>>
  isAuthorized(): Promise<boolean>
}

type CrossVmConnectorConfig<ProviderTypes extends {}> = {
  onConnected?(session: CrossVmSession<ProviderTypes>): void
  onDisconnected?(): void
}

type CreateCrossVmConnectorFn<ProviderTypes extends {}> = (
  config: CrossVmConnectorConfig<ProviderTypes>
) => CrossVmConnector<ProviderTypes>

// TODO: Connectors should be allowed to be added dynamically.
export function createCrossVmUser<ProviderTypes extends {}>(params?: {
  connectors?: CreateCrossVmConnectorFn<ProviderTypes>[]
}) {
  type CrossVmConnection = {
    readonly connector: CrossVmConnector<ProviderTypes> | undefined
  }

  type CrossVmState = {
    connection: CrossVmConnection | null
    status: "connecting" | "connected" | "disconnected"
  }

  type PersistentState = {
    connection: string | undefined
  }

  const STORAGE_KEY = "cross-vm-connection"

  const connectors = new BehaviorSubject<
    CrossVmConnector<Partial<ProviderTypes>>[]
  >(
    params?.connectors?.map(createConnector => {
      const connector = createConnector({
        onConnected: () => setConnected(connector),
        onDisconnected() {
          setDisconnected(connector)
        },
      })

      return connector
    }) || []
  )

  const store = new BehaviorSubject<CrossVmState>(
    (() => {
      const persistentState = localStorage.getItem(STORAGE_KEY)
      if (!persistentState) return {connection: null, status: "disconnected"}

      const {connection: persistedUid} = JSON.parse(
        persistentState
      ) as PersistentState
      const connector = connectors
        .getValue()
        .find(connector => connector.uid === persistedUid)

      // Wait for the connector to be added.
      if (persistedUid && !connector) {
        // TODO: Add Timeout if it takes too long.
        const unsub = connectors.subscribe(_connectors => {
          const connector = _connectors.find(
            connector => connector.uid === persistedUid
          )

          if (connector) {
            setConnected(connector)
            connector?.connect({isReconnecting: true})

            setTimeout(unsub, 0)
          }
        })

        return {connection: null, status: "connecting"}
      }

      return {
        connection: connector ? {connector} : null,
        status: connector ? "connected" : "disconnected",
      }
    })()
  )

  // Persist the current connector state.
  store.subscribe(state => {
    const persistentState: PersistentState = {
      connection: state.connection?.connector?.uid,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentState))
  })

  //
  // State change handlers
  //

  async function setConnected(
    connector: CrossVmConnector<Partial<ProviderTypes>>
  ) {
    store.next({connection: {connector}, status: "connected"})
  }

  async function setDisconnected(
    connector: CrossVmConnector<Partial<ProviderTypes>>
  ) {
    const connection = store.getValue().connection
    if (connection?.connector !== connector) return

    store.next({connection: null, status: "disconnected"})
  }

  return {
    get state() {
      return store.getValue()
    },
    get connectors() {
      return connectors.getValue()
    },
    async registerConnector(
      createConnectorFn: CreateCrossVmConnectorFn<ProviderTypes>
    ) {
      store.next({...store.getValue(), status: "connecting"})

      const connector = createConnectorFn({
        onConnected: () => setConnected(connector),
        onDisconnected() {
          setDisconnected(connector)
        },
      })
      connectors.next([...connectors.getValue(), connector])

      await connector.connect()

      store.next({
        ...store.getValue(),
        connection: {connector},
        status: "connected",
      })

      debugger
    },
  }
}

// Utility function for type inference.
export function createCrossVmConnector<
  ProviderTypes extends {} = {},
  CreateConnectorFn = CreateCrossVmConnectorFn<ProviderTypes>,
>(createConnector: CreateConnectorFn) {
  return createConnector
}
