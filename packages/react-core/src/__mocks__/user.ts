import {CurrentUser} from "@onflow/react-core"

const mockSubscribe = () => () => {}

export const defaultUser: CurrentUser = {
  f_type: "USER",
  f_vsn: "1.0.0",
  loggedIn: false,
  services: [],
  subscribe: mockSubscribe,
}

export const authenticatedUser: CurrentUser = {
  f_type: "USER",
  f_vsn: "1.0.0",
  loggedIn: true,
  addr: "0x1234",
  services: [],
  subscribe: mockSubscribe,
}
