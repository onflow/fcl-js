import ProviderContract from 0x01

transaction {
    prepare(acct: AuthAccount) {
        ProviderContract.mintProviderAndSaveAndLink(account: acct, addr: acct.address, pid: "dapper-pid", authn: "https://www.dapperlabs.com/", label: "Dapper Provider", icon: "DapperCute.png")
        
        log("Provider created and saved")
    }
    
    post {
        // Check that the capabilities were created correctly
        getAccount(0x01).getCapability(/public/Provider)!
                        .check<&ProviderContract.Provider{ProviderContract.ProviderInterface}>():  
                        "Identity Reference was not created correctly"
    }
}