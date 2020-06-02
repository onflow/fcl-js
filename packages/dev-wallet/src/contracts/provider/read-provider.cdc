import ProviderContract from 0x01

pub fun main() {
    var pi = ProviderContract.readProvider(pid: "dapper-pid")
  
   log(pi.getPid());
}
