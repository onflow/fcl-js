pub contract IdentityContract {

    pub event IdentityCreated(address: Address)
    pub event IdentityUpdated(address: Address)

    pub struct interface AuthenticationHookInterface {
        pub id: String?
        pub addr: String?
        pub method: String?
        pub endpoint: String?
        pub data: {String:AnyStruct}?
    }

    pub struct AuthenticationHook: AuthenticationHookInterface {
        pub var id: String?
        pub var addr: String?
        pub var method: String?
        pub var endpoint: String?
        pub var data: {String:AnyStruct}?

        init(id: String?, addr: String?, method: String?, endpoint: String?, data: {String:AnyStruct}?) {
            self.id = id
            self.addr = addr
            self.method = method
            self.endpoint = endpoint
            self.data = data
        }
    }

    pub resource interface PublicIdentity {
        pub name: String?
        pub avatar: String?
        pub cover: String?
        pub color: String?
        pub bio: String?
        pub authorizations: [AnyStruct{AuthenticationHookInterface}]
    }

    pub resource interface ModifyIdentity {
        pub fun setName(name: String): Void
        pub fun setAvatar(avatar: String): Void
        pub fun setCover(cover: String): Void
        pub fun setColor(color: String): Void
        pub fun setBio(bio: String): Void
        pub fun addAuthorization(authorization: AnyStruct{AuthenticationHookInterface}): Void
        pub fun updateAuthorization(authorization: AnyStruct{AuthenticationHookInterface}): Void
        pub fun removeAuthorization(id: String): Void
    }   

    pub resource Identity: PublicIdentity, ModifyIdentity {
        pub var address: Address
        pub var name: String?
        pub var avatar: String?
        pub var cover: String?
        pub var color: String?
        pub var bio: String?
        pub var authorizations: [AnyStruct{AuthenticationHookInterface}]

        init(address: Address, name: String?, avatar: String?, cover: String?, color: String?, bio: String?, authorizations: [AnyStruct{AuthenticationHookInterface}]?) {
            self.address = address
            self.name = name
            self.avatar = avatar
            self.cover = cover
            self.color = color
            self.bio = bio
            self.authorizations = authorizations != nil ? authorizations! : []
            
            emit IdentityCreated(address: self.address)
        }

        pub fun setName(name: String): Void {
            self.name = name
            emit IdentityUpdated(address: self.address)
        }
        pub fun setAvatar(avatar: String): Void {
            self.avatar = avatar
            emit IdentityUpdated(address: self.address)
        }
        pub fun setCover(cover: String): Void {
            self.cover = cover
            emit IdentityUpdated(address: self.address)
        }
        pub fun setColor(color: String): Void {
            self.color = color
            emit IdentityUpdated(address: self.address)
        }
        pub fun setBio(bio: String): Void {
            self.bio = bio
            emit IdentityUpdated(address: self.address)
        }
        pub fun addAuthorization(authorization: AnyStruct{AuthenticationHookInterface}): Void {
            self.updateAuthorization(authorization: authorization)
            emit IdentityUpdated(address: self.address)
        }
        pub fun removeAuthorization(id: String): Void {
            var i = 0
            while (i < self.authorizations.length) {
                if (self.authorizations[i].id == id) {
                    self.authorizations.remove(at: i)
                    break;
                }
                i = i + 1
            }
            emit IdentityUpdated(address: self.address)
        }
        pub fun updateAuthorization(authorization: AnyStruct{AuthenticationHookInterface}): Void {
            var i = 0
            while (i < self.authorizations.length) {
                if (self.authorizations[i].id == authorization.id) {
                    self.authorizations.remove(at: i)
                    break;
                }
                i = i + 1
            }
            self.authorizations.append(authorization)
            emit IdentityUpdated(address: self.address)
        }
    }

    pub fun createAuthenticationHook(id: String?, addr: String?, method: String?, endpoint: String?, data: {String:AnyStruct}?): AnyStruct{AuthenticationHookInterface} {
        return AuthenticationHook(id: id, addr: addr, method: method, endpoint: endpoint, data: data);
    }

    pub fun mintIdentity(address: Address, name: String?, avatar: String?, cover: String?, color: String?, bio: String?, authorizations: [AnyStruct{AuthenticationHookInterface}]?): @Identity {
        return <- create Identity(address: address, name: name, avatar: avatar, cover: cover, color: color, bio: bio, authorizations: authorizations)
    }

    pub fun mintIdentityAndSaveAndLink(account: AuthAccount, name: String?, avatar: String?, cover: String?, color: String?, bio: String?, authorizations: [AnyStruct{AuthenticationHookInterface}]?) {
        let identity: @Identity <- self.mintIdentity(address: account.address, name: name, avatar: avatar, cover: cover, color: color, bio: bio, authorizations: authorizations)
        account.save(<-identity, to: /storage/Identity)
        account.link<&IdentityContract.Identity{IdentityContract.PublicIdentity}>(/public/Identity, target: /storage/Identity)
    }

    pub fun readPublicIdentity(addr: Address): &{PublicIdentity} {
        let IdentityInterfaceCapability = getAccount(addr).getCapability(/public/Identity)!
        let PublicIdentityeRef = IdentityInterfaceCapability.borrow<&Identity{PublicIdentity}>()! as &Identity{PublicIdentity}
        return PublicIdentityeRef
    }

    init() {
        log("Identity Contract Init")
    }
}
 