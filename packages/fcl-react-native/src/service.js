export const makeServicePlugin = (opts = {}) => ({
  name: "fcl-plugin-service-ReactNative",
  f_type: "ServicePlugin",
  type: "discovery-service",
  services: makeReactNativeServices(opts),
  serviceStrategy: { method: "ReactNative/RPC", exec: makeExec(opts) },
});

const makeExec = ({ mountWebView, unMountWebView }) => {
  return ({ service, body, opts, config }) => {
    return new Promise((resolve, reject) => {

      mountWebView({ service, body, opts, config, resolve, reject });
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
