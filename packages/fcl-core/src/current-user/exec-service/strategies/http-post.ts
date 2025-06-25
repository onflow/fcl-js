import {fetchService} from "./utils/fetch-service"
import {normalizePollingResponse} from "../../../normalizers/service/polling-response"
import {normalizeLocalView} from "../../../normalizers/service/local-view"
import {poll} from "./utils/poll"
import {VERSION} from "../../../VERSION"
import {serviceEndpoint} from "../strategies/utils/service-endpoint"
import {Service} from "@onflow/typedefs"

export interface ExecHttpPostParams {
  service: Service & {
    data?: Record<string, any>
    type: string
  }
  body: Record<string, any>
  config: Record<string, any>
  opts: Record<string, any>
}

export type ExecLocalFunction = (
  view: any,
  options: {
    serviceEndpoint: typeof serviceEndpoint
    onClose: () => void
  }
) => Promise<[any, () => void]>

/**
 * @description Creates an HTTP POST strategy executor that handles wallet service communication
 * via HTTP POST requests. This function manages the full lifecycle including polling for
 * responses, handling local views, and managing user interactions.
 *
 * @param execLocal Function to execute local view rendering and user interaction
 * @returns HTTP POST strategy function that can be used to execute services
 *
 * @example
 * // Create an HTTP POST executor
 * const httpPostExec = getExecHttpPost(async (view, { serviceEndpoint, onClose }) => {
 *   // Render local view and return cleanup function
 *   return [viewData, () => cleanup()]
 * })
 */
export const getExecHttpPost =
  (execLocal: ExecLocalFunction) =>
  async ({service, body, config, opts}: ExecHttpPostParams): Promise<any> => {
    const resp = await fetchService(service, {
      data: {
        fclVersion: VERSION,
        service: {
          params: service.params,
          data: service.data,
          type: service.type,
        },
        config,
        ...body,
      },
    }).then(normalizePollingResponse)

    if (resp?.status === "APPROVED") {
      return resp.data
    } else if (resp?.status === "DECLINED") {
      throw new Error(`Declined: ${resp.reason || "No reason supplied."}`)
    } else if (resp?.status === "REDIRECT") {
      return resp
    } else if (resp?.status === "PENDING") {
      // these two flags are required to run polling one more time before it stops
      let canContinue = true
      let shouldContinue = true

      const [_, unmount] = await execLocal(normalizeLocalView(resp.local), {
        serviceEndpoint,
        onClose: () => (shouldContinue = false),
      })

      const close = () => {
        try {
          unmount()
          shouldContinue = false
        } catch (error) {
          console.error("Frame Close Error", error)
        }
      }

      /**
       * this function is run once per poll call.
       * Offsetting canContinue flag to make sure that
       * the polling is performed one extra time after canContinue flag is set to false
       * to prevent halting on Android when a browser calls window.close
       * before FCL receives a successful result from polling
       *
       * @returns {boolean}
       */
      const checkCanContinue = () => {
        const offsetCanContinue = canContinue
        canContinue = shouldContinue
        return offsetCanContinue
      }

      return poll(resp.updates, checkCanContinue)
        .then(serviceResponse => {
          close()
          return serviceResponse
        })
        .catch(error => {
          console.error(error)
          close()
          throw error
        })
    } else {
      console.error(`Auto Decline: Invalid Response`, {service, resp})
      throw new Error(`Auto Decline: Invalid Response`)
    }
  }
