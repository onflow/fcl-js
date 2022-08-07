export const ServicePlugin = client => ({
  name: "WalletConnect",
  type: "DiscoveryService",
  services: createWcServices(client.pairing.getAll({active: true})),
  /*  serviceStrategy
    returns Promise that returns a PollingResponse
    return new Promise((resolve, reject) => {
      resolve(PollingResponse)
      reject(`Declined: ${resp.reason || "No reason supplied"}`)
    }) 
*/
  serviceStrategy: serviceStrategy(client),
})

const serviceStrategy = client => {
  return ({service, msg, opts, config} = {}) => {
    return client
  }
}

function createWcServices(pairings = []) {
  return [
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authn",
      name: "WC",
      method: "WC/RPC",
      uid: "wc#authn",
      endpoint: "flow_authn",
      optIn: true,
      provider: {
        address: "0x123",
        name: "WalletConnect",
        icon: "https://avatars.githubusercontent.com/u/37784886",
        description: "",
        color: "",
        supportEmail: "",
        website: "",
      },
    },
    ...pairings.map(pairing => {
      return {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "Authn",
        method: "WC/RPC",
        uid: null,
        endpoint: "flow_authn",
        optIn: true,
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
