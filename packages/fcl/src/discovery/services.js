import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {send} from "@onflow/util-actor"
import {VERSION} from "../VERSION"
import SERVICE_ACTOR_KEYS from "./services/authn"

const isWindow = () => typeof window !== "undefined"

if (isWindow()) {
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      send(SERVICE_ACTOR_KEYS.NAME, SERVICE_ACTOR_KEYS.UPDATE_RESULTS, await getServices({ type: "authn" }))
    }
  })
}

export async function getServices({ type }) {
  const endpoint = await config.get("discovery.authn.endpoint")
  invariant(Boolean(endpoint), `"discovery.authn.endpoint" in config must be defined.`)

  const include = await config.get("discovery.authn.include", [])
  const url = new URL(endpoint)

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fclVersion: VERSION,
      include,
      extensions: isWindow() ? (window.fcl_extensions || []) : [],
      userAgent: window?.navigator?.userAgent
    })
  }).then(d => d.json())
}