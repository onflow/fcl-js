import IdentityContract from 0x01

pub fun main(): AnyStruct {

   var pi: AnyStruct = IdentityContract.readPublicIdentity(addr: 0x01)

   log(pi)

   return IdentityContract.readPublicIdentity(addr: 0x01)
}

 