import { WebView } from "react-native";
import { invariant } from "@onflow/util-invariant";
import { log, LEVELS } from "@onflow/util-logger";
import { fetchFlowWallets, isMobile, CONFIGURED_NETWORK, isIOS } from "./utils";
import { FLOW_METHODS, REQUEST_TYPES } from "./constants";

export const makeServicePlugin = (opts = {}) => ({
  name: "fcl-plugin-service-ReactNative",
  f_type: "ServicePlugin",
  type: "discovery-service",
  services: makeReactNativeServices(opts),
  serviceStrategy: { method: "ReactNative/RPC", exec: makeExec(opts) },
});

const makeExec = ({ mountWebView, unMountWebView }) => {
  return ({ service, body, opts }) => {
    return new Promise(async (resolve, reject) => {
      // invariant(client, "ReactNative is not initialized");
      let session, pairing, windowRef;
      const method = service.endpoint;

      console.log("in exec!!! :) ", mountWebView);

      mountWebView({ endpoint: method });
    });
  };
};

const makeBaseReactNativeService = () => {
  return {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "authn",
    method: "ReactNative/RPC",
    uid: "https://reactnative.dev",
    endpoint: "flow_authn",
    optIn: false,
    provider: {
      address: null,
      name: "ReactNative",
      icon: "https://avatars.githubusercontent.com/u/37784886",
      description: "ReactNative Base Service",
      website: "https://reactnative.dev",
      color: null,
      supportEmail: null,
    },
  };
};

function makeReactNativeServices(opts = {}) {
  const ReactNativeBaseService = makeBaseReactNativeService();
  return [ReactNativeBaseService];
}
