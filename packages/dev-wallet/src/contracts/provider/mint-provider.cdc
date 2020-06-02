import ProviderContract from 0x01

transaction {
    prepare(acct: AuthAccount) {
        ProviderContract.mintProviderAndSaveAndLink(account: acct, addr: acct.address, pid: "dapper-pid", authn: "https://www.dapperlabs.com/", label: "Dapper Provider", icon: "DapperCute.png")
        
        log("Provider created and saved")
    }
}