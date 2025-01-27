import {CurrentUser, Service} from "@onflow/typedefs"
import * as fcl from "@onflow/fcl"

export class User {
  constructor(
    private user: typeof fcl.currentUser,
    private fclService: Service
  ) {}

  async onAddressChanged(callback: (address: string) => void) {
    this.user.subscribe((currentUser: CurrentUser) => {
      callback(currentUser.addr)
    })
  }

  private deriveEthereumAddress() {
    return this.user.addr
  }
}
