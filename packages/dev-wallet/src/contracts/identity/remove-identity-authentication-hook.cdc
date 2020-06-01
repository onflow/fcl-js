import IdentityContract from 0x01

transaction {
    prepare(acct: AuthAccount) {
        let updateRef = acct.borrow<&IdentityContract.Identity>(from: /storage/Identity)!
        updateRef.removeAuthorization(id: "auth-id")
    }
    
    post {
        getAccount(0x01).getCapability(/public/Identity)!
                        .check<&IdentityContract.Identity{IdentityContract.PublicIdentity}>():  
                        "Identity Reference was not created correctly"
    }
}
 