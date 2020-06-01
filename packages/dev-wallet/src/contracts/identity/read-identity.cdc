import IdentityContract from 0x01

pub fun main() {
   var pi = IdentityContract.readPublicIdentity(addr: 0x01)
  
   log(pi.name);
   log(pi.authorizations.length > 0 ? pi.authorizations[0].addr : "No authorizations");
}
