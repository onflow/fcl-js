import {
  spawn,
  subscriber,
  snapshoter,
  INIT,
  SUBSCRIBE,
  UNSUBSCRIBE,
  send,
  Letter as ActorLetter,
  ActorContext,
} from "@onflow/util-actor"
import {getServices} from "../services"
import {LEVELS, log} from "@onflow/util-logger"
import {Service} from "@onflow/typedefs"
import {FCLContext} from "../../context"
import {createPartialGlobalFCLContext} from "../../context/global"

export const SERVICE_ACTOR_KEYS = {
  AUTHN: "authn",
  RESULTS: "results",
  SNAPSHOT: "SNAPSHOT",
  UPDATED: "UPDATED",
  UPDATE_RESULTS: "UPDATE_RESULTS",
} as const

export interface ServiceData {
  results: Service[]
}

export type SubscriptionCallback = (
  data: Service[] | null,
  error: Error | null
) => void

export interface Authn {
  subscribe: (cb: SubscriptionCallback) => () => void
  snapshot: () => Promise<ServiceData>
  update: () => void
}

const warn = (fact: boolean, msg: string): void => {
  if (fact) {
    console.warn(
      `
      %cFCL Warning
      ============================
      ${msg}
      For more info, please see the docs: https://docs.onflow.org/fcl/
      ============================
      `,
      "font-weight:bold;font-family:monospace;"
    )
  }
}

const fetchServicesFromDiscovery = async (
  context: Pick<FCLContext, "config">
): Promise<void> => {
  try {
    const services = await getServices({
      context,
      types: [SERVICE_ACTOR_KEYS.AUTHN],
    })
    send(SERVICE_ACTOR_KEYS.AUTHN, SERVICE_ACTOR_KEYS.UPDATE_RESULTS, {
      results: services,
    })
  } catch (error: any) {
    log({
      title: `${error.name} Error fetching Discovery API services.`,
      message: error.message,
      level: LEVELS.error,
    })
  }
}

function createHandlers(context: Pick<FCLContext, "config">) {
  return {
    [INIT]: async (ctx: ActorContext) => {
      warn(
        typeof window === "undefined",
        '"fcl.discovery" is only available in the browser.'
      )
      // If you call this before the window is loaded extensions will not be set yet
      if (document.readyState === "complete") {
        fetchServicesFromDiscovery(context)
      } else {
        window.addEventListener("load", () => {
          fetchServicesFromDiscovery(context)
        })
      }
    },
    [SERVICE_ACTOR_KEYS.UPDATE_RESULTS]: (
      ctx: ActorContext,
      _letter: ActorLetter,
      data: ServiceData
    ) => {
      ctx.merge(data)
      ctx.broadcast(SERVICE_ACTOR_KEYS.UPDATED, {...ctx.all()})
    },
    [SUBSCRIBE]: (ctx: ActorContext, letter: ActorLetter) => {
      ctx.subscribe(letter.from!)
      ctx.send(letter.from!, SERVICE_ACTOR_KEYS.UPDATED, {...ctx.all()})
    },
    [UNSUBSCRIBE]: (ctx: ActorContext, letter: ActorLetter) =>
      ctx.unsubscribe(letter.from!),
    [SERVICE_ACTOR_KEYS.SNAPSHOT]: async (
      ctx: ActorContext,
      letter: ActorLetter
    ) => letter.reply({...ctx.all()}),
  }
}

const spawnProviders = (context: Pick<FCLContext, "config">) =>
  spawn(createHandlers(context) as any, SERVICE_ACTOR_KEYS.AUTHN)

/**
 * Discovery authn service for interacting with Flow compatible wallets.
 *
 * Discovery abstracts away code so that developers don't have to deal with the discovery
 * of Flow compatible wallets, integration, or authentication. Using discovery from FCL
 * allows dapps to list and authenticate with wallets while having full control over the UI.
 * Common use cases for this are login or registration pages.
 *
 * NOTE: The following methods can only be used in web browsers.
 *
 * WARNING: discovery.authn.endpoint value MUST be set in the configuration before calling this method.
 *
 * @example
 * // Basic usage with React
 * import './config';
 * import { useState, useEffect } from 'react';
 * import * as fcl from '@onflow/fcl';
 *
 * function Component() {
 *   const [wallets, setWallets] = useState([]);
 *   useEffect(
 *     () => fcl.discovery.authn.subscribe((res) => setWallets(res.results)),
 *     [],
 *   );
 *
 *   return (
 *     <div>
 *       {wallets.map((wallet) => (
 *         <button
 *           key={wallet.provider.address}
 *           onClick={() => fcl.authenticate({ service: wallet })}
 *         >
 *           Login with {wallet.provider.name}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Configuration for opt-in services
 * import { config } from '@onflow/fcl';
 *
 * config({
 *   'discovery.authn.endpoint':
 *     'https://fcl-discovery.onflow.org/api/testnet/authn', // Endpoint set to Testnet
 *   'discovery.authn.include': ['0x9d2e44203cb13051'], // Ledger wallet address on Testnet set to be included
 *   'discovery.authn.exclude': ['0x123456789abcdef01'], // Example of excluding a wallet by address
 * });
 */
function createAuthn(context: Pick<FCLContext, "config">): Authn {
  /**
   * @description Discovery methods for interacting with Authn.
   */
  const authn: Authn = {
    /**
     * Subscribe to Discovery authn services and receive real-time updates.
     *
     * This method allows you to subscribe to changes in the available authentication services.
     * When new services are discovered or existing ones are updated, the callback function will be invoked.
     *
     * @param cb Callback function that receives the list of available services and any error
     * @returns A function to unsubscribe from the service updates
     *
     * @example
     * import * as fcl from '@onflow/fcl';
     *
     * const unsubscribe = fcl.discovery.authn.subscribe((services, error) => {
     *   if (error) {
     *     console.error('Discovery error:', error);
     *     return;
     *   }
     *   console.log('Available services:', services);
     * });
     *
     * // Later, to stop receiving updates
     * unsubscribe();
     */
    subscribe: cb =>
      subscriber(SERVICE_ACTOR_KEYS.AUTHN, () => spawnProviders(context), cb),

    /**
     * Get the current snapshot of Discovery authn services.
     *
     * This method returns a promise that resolves to the current state of available authentication services
     * without setting up a subscription. Useful for one-time checks or initial state loading.
     *
     * @returns A promise that resolves to the current service data
     *
     * @example
     * import * as fcl from '@onflow/fcl';
     *
     * async function getServices() {
     *   try {
     *     const serviceData = await fcl.discovery.authn.snapshot();
     *     console.log('Current services:', serviceData.results);
     *   } catch (error) {
     *     console.error('Failed to get services:', error);
     *   }
     * }
     */
    snapshot: () =>
      snapshoter(SERVICE_ACTOR_KEYS.AUTHN, () => spawnProviders(context)),

    /**
     * Trigger an update of authn services from the discovery endpoint.
     *
     * This method manually triggers a refresh of the available authentication services
     * from the configured discovery endpoint. Useful when you want to force a refresh
     * of the service list.
     *
     * @example
     * import * as fcl from '@onflow/fcl';
     *
     * // Force refresh of available services
     * fcl.discovery.authn.update();
     */
    update: () => {
      // Only fetch services if the window is loaded
      // Otherwise, this will be called by the INIT handler
      if (document.readyState === "complete") {
        fetchServicesFromDiscovery(context)
      }
    },
  }

  return authn
}

const authn = /* @__PURE__ */ createAuthn(createPartialGlobalFCLContext())

export default authn
