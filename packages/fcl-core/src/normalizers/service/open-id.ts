import {Service} from "@onflow/typedefs"

/**
 * @description Normalizes an open-id service to ensure compatibility with FCL service format
 *
 * @param service The open-id service to normalize
 * @returns The normalized open-id service or null
 *
 * @example
 * const service = normalizeOpenId({
 *   f_type: "Service",
 *   f_vsn: "1.0.0",
 *   type: "open-id",
 *   uid: "uniqueDedupeKey",
 *   method: "data",
 *   data: {
 *      profile: {
 *        name: "Bob",
 *        family_name: "Builder",
 *        given_name: "Robert",
 *        middle_name: "the",
 *        nickname: "Bob the Builder",
 *        preferred_username: "bob",
 *        profile: "https://www.bobthebuilder.com/",
 *        picture: "https://avatars.onflow.org/avatar/bob",
 *        gender: "...",
 *        birthday: "2001-01-18",
 *        zoneinfo: "America/Vancouver",
 *        locale: "en-us",
 *        updated_at: "1614970797388"
 *      },
 *      email: {
 *        email: "bob@bob.bob",
 *        email_verified: true
 *      },
 *      address: {
 *        address: "One Apple Park Way, Cupertino, CA 95014, USA"
 *      },
 *      phone: {
 *        phone_number: "+1 (xxx) yyy-zzzz",
 *        phone_number_verified: true
 *      },
 *      social: {
 *        twitter: "@_qvvg",
 *        twitter_verified: true
 *      },
 *   }
 * })
 */
export function normalizeOpenId(service: Service | null): Service | null {
  if (service == null) return null

  switch (service["f_vsn"]) {
    case "1.0.0":
      return service

    default:
      return null
  }
}
