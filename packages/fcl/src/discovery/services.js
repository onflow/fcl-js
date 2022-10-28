import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {serviceRegistry} from "../current-user/exec-service/plugins"
import {getChainId} from "../utils"
import {VERSION} from "../VERSION"
import {makeDiscoveryServices} from "./utils"

export async function getServices({types}) {
  const endpoint = await config.get("discovery.authn.endpoint")
  invariant(
    Boolean(endpoint),
    `"discovery.authn.endpoint" in config must be defined.`
  )

  const include = await config.get("discovery.authn.include", [])
  const url = new URL(endpoint)

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: types,
      fclVersion: VERSION,
      include,
      clientServices: await makeDiscoveryServices(),
      supportedStrategies: serviceRegistry.getStrategies(),
      userAgent: window?.navigator?.userAgent,
      network: await getChainId(),
    }),
  }).then(d => d.json())
}
