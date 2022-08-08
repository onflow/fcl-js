export const ServicePlugin = client => ({
  name: "WalletConnect",
  type: "DiscoveryService",
  services: makeWcServices(client.pairing.getAll({active: true})),
  serviceStrategy: makeServiceStrategy(client),
})

const makeServiceStrategy = client => {
  return (service, body, opts, fullConfig) => {
    return new Promise(async (resolve, reject) => {})
  }
}

function makeWcServices(pairings = []) {
  return [
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authn",
      name: "WC",
      method: "WC/RPC",
      uid: "wc#authn",
      endpoint: "flow_authn",
      optIn: false,
      provider: {
        address: null,
        name: "WalletConnect",
        icon: "https://avatars.githubusercontent.com/u/37784886",
        description: "",
        color: "",
        supportEmail: "",
        website: "https://walletconnect.com/",
      },
    },
    ...pairings.map(pairing => {
      return {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        method: "WC/RPC",
        uid: "wc#authn",
        endpoint: "flow_authn",
        optIn: false,
        provider: {
          ...pairing,
          address: pairing.topic,
          name: pairing.peerMetadata.name,
          icon: pairing.peerMetadata.icons[0],
          description: pairing.peerMetadata.description,
          website: pairing.peerMetadata.url,
          color: "",
          supportEmail: "",
        },
      }
    }),
  ]
}
