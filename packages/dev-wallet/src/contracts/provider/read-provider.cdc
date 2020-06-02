import ProviderContract from 0x01

pub fun main() {
    var pi = ProviderContract.readProvider(pid: "01")
  
   log(pi.authn);
}
