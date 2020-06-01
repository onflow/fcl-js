import IdentityContract from 0x01

transaction {
    prepare(acct: AuthAccount) {
        let updateRef = acct.borrow<&IdentityContract.Identity>(from: /storage/Identity)!
        updateRef.updateAuthorization(authorization: IdentityContract.createAuthenticationHook(
            id: "auth-id",
            addr: "auth-addr-updated",
            method: "auth-method-updated",
            endpoint: "auth-endpoint-updated",
            data: { 
                "key": "val-updated"
            }
        ))
    }
    
    post {
        getAccount(0x01).getCapability(/public/Identity)!
                        .check<&IdentityContract.Identity{IdentityContract.PublicIdentity}>():  
                        "Identity Reference was not created correctly"
    }
}
 