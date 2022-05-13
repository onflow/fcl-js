import Client, {CLIENT_EVENTS} from "@walletconnect/client"
import QRCodeModal from "@walletconnect/legacy-modal"
import {ERROR, getAppMetadata} from "@walletconnect/utils"

const INIT_DATA = {
  RELAY_URL: "wss://relay.walletconnect.com",
  LOGGER: "debug",
}
const data = {
  client: null,
}

const fclWC = {
  init: async projectId => {
    if (data.client) {
      return data.client
    }
    data.client = await Client.init({
      logger: INIT_DATA.LOGGER,
      relayUrl: INIT_DATA.RELAY_URL,
      projectId: projectId,
    })

    return {client: data.client, CLIENT_EVENTS, QRCodeModal}
  },
  Client,
  CLIENT_EVENTS,
  QRCodeModal,
  ERROR,
  getAppMetadata,
}

export default fclWC
