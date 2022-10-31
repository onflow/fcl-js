import { log, LEVELS } from "@onflow/util-logger";
import { config } from "@onflow/config";
import { invariant } from "@onflow/util-invariant";

export let CONFIGURED_NETWORK = null;

// export const setConfiguredNetwork = async () => {
//   CONFIGURED_NETWORK = await config.get("flow.network");
//   invariant(
//     CONFIGURED_NETWORK === "mainnet" || CONFIGURED_NETWORK === "testnet",
//     "FCL Configuration value for 'flow.network' is required (testnet || mainnet)"
//   );
// };

export function isAndroid() {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  );
}

export function isSmallIOS() {
  return (
    typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent)
  );
}

export function isLargeIOS() {
  return typeof navigator !== "undefined" && /iPad/.test(navigator.userAgent);
}

export function isIOS() {
  return isSmallIOS() || isLargeIOS();
}

export function isMobile() {
  return isAndroid() || isIOS();
}
