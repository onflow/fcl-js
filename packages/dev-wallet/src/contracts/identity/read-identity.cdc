import IdentityContract from 0x01

pub fun main() {
   var pi = IdentityContract.readPublicIdentity(addr: 0x01)
  
   log(pi.getName());
   log(pi.getAuthorizations().length > 0 ? pi.getAuthorizations()[0].getAddr() : "No authorizations");
}
