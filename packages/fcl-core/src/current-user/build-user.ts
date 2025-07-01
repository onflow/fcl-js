import * as rlp from "@onflow/rlp"
import {CurrentUser, Service} from "@onflow/typedefs"
import {withPrefix} from "@onflow/util-address"
import {USER_PRAGMA} from "../normalizers/service/__vsn"
import {normalizeServices} from "../normalizers/service/service"
import {fetchServices} from "./fetch-services"
import {mergeServices} from "./merge-services"
import {serviceOfType} from "./service-of-type"

export interface UserData {
  addr: string | null
  paddr?: string | null
  services?: Service[]
  hks?: string
  code?: string
  expires?: number
  [key: string]: any
}

function deriveCompositeId(authn: Service): string {
  return rlp
    .encode([
      authn.provider?.address || authn.provider?.name || "UNSPECIFIED",
      (authn as any).id,
    ])
    .toString("hex")
}

function normalizeData(data: UserData): UserData {
  data.addr = data.addr ? withPrefix(data.addr) : null
  data.paddr = data.paddr ? withPrefix(data.paddr) : null
  return data
}

/**
 * @description Builds a complete CurrentUser object from user data by normalizing addresses,
 * fetching additional services, and creating a composite ID. This function handles the
 * construction of the user object that represents the authenticated state in FCL.
 *
 * @param data The user data containing address, services, and authentication information
 * @returns Promise resolving to a CurrentUser object with normalized data and services
 *
 * @example
 * // Build a user object from authentication data
 * const userData = {
 *   addr: "0x1234567890abcdef",
 *   services: [...],
 *   hks: "https://wallet.example.com/hooks",
 *   code: "auth_code_123"
 * }
 * const user = await buildUser(userData)
 * console.log(user.addr) // "0x1234567890abcdef"
 */
export async function buildUser(data: UserData): Promise<CurrentUser> {
  data = normalizeData(data)

  var services = normalizeServices(
    mergeServices(
      data.services || [],
      await fetchServices(data.hks!, data.code!)
    )
  )

  const authn = serviceOfType(services, "authn") as Service

  return {
    ...USER_PRAGMA,
    addr: withPrefix(data.addr!),
    cid: deriveCompositeId(authn),
    loggedIn: true,
    services: services,
    expiresAt: data.expires,
  }
}
