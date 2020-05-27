import ProviderContract from 0x01

transaction {
    prepare(acct: AuthAccount) {
        let provider <- ProviderContract.createProvider(addr: acct.address, pid: "dapper-pid", authn: "https://www.dapperlabs.com/", label: "Dapper Provider", icon: "DapperCute.png")

        acct.save(<-provider, to: /storage/provider)

        log("Provider created and saved")
    }
}