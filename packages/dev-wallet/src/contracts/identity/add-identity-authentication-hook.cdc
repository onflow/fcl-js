import IdentityContract from 0x01

transaction {
    prepare(acct: AuthAccount) {
        let updateRef = acct.borrow<&IdentityContract.Identity>(from: /storage/Identity)!
        updateRef.updateAuthorization(authorization: IdentityContract.createAuthenticationHook(
            id: "auth-id-2",
            addr: "auth-addr-2",
            method: "auth-method-2",
            endpoint: "auth-endpoint-2",
            data: { 
                "key": "val-2"
            }
        ))
    }
    
    post {
        getAccount(0x01).getCapability(/public/Identity)!
                        .check<&IdentityContract.Identity{IdentityContract.PublicIdentity}>():  
                        "Identity Reference was not created correctly"
    }
}
 