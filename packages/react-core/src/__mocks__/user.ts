import {CurrentUser} from "@onflow/typedefs"

export const defaultUser: CurrentUser = {
  f_type: "USER",
  f_vsn: "1.0.0",
  loggedIn: false,
  services: [],
}

export const authenticatedUser: CurrentUser = {
  f_type: "USER",
  f_vsn: "1.0.0",
  loggedIn: true,
  addr: "0x1234",
  services: [],
}
