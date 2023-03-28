import {config} from '@onflow/fcl'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_STORAGE = {
  can: true,
  get: async key => JSON.parse(await AsyncStorage.getItem(key)),
  put: async (key, value) => await AsyncStorage.setItem(key, JSON.stringify(value)),
}

config({
  // 'accessNode.api': 'https://testnet.onflow.org',
  'accessNode.api': 'https://rest-testnet.onflow.org',
  // 'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'discovery.wallet': 'https://flow-wallet-dev.blocto.app/authn',
  "discovery.wallet.method.default": "ReactNative/RPC",
  "fcl.storage.default": SESSION_STORAGE,
})
