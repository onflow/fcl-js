pub contract IdentityContract {

    pub event IdentityCreated(address: Address)
    pub event IdentityUpdated(address: Address)

    pub struct interface AuthenticationHookInterface {
        pub fun getId(): String?
        pub fun getAddr(): String?
        pub fun getMethod(): String?
        pub fun getEndpoint(): String?
        pub fun getData(): {String:AnyStruct}?
    }

    pub struct AuthenticationHook: AuthenticationHookInterface {
        access(self) var id: String?
        access(self) var addr: String?
        access(self) var method: String?
        access(self) var endpoint: String?
        access(self) var data: {String:AnyStruct}?

        init(id: String?, addr: String?, method: String?, endpoint: String?, data: {String:AnyStruct}?) {
            self.id = id
            self.addr = addr
            self.method = method
            self.endpoint = endpoint
            self.data = data
        }

        pub fun getId(): String? {
            return self.id
        }
        pub fun getAddr(): String? {
            return self.addr
        }
        pub fun getMethod(): String? {
            return self.method
        }
        pub fun getEndpoint(): String? {
            return self.endpoint
        }
        pub fun getData(): {String:AnyStruct}? {
            return self.data
        }
    }

    pub resource interface PublicIdentity {
        pub fun getAddress(): Address
        pub fun getName(): String?
        pub fun getAvatar(): String?
        pub fun getCover(): String?
        pub fun getColor(): String?
        pub fun getBio(): String?
        pub fun getAuthorizations(): [AnyStruct{AuthenticationHookInterface}]
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
        access(self) var address: Address
        access(self) var name: String?
        access(self) var avatar: String?
        access(self) var cover: String?
        access(self) var color: String?
        access(self) var bio: String?
        access(self) var authorizations: [AnyStruct{AuthenticationHookInterface}]

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

        pub fun getAddress(): Address {
            return self.address
        }
        pub fun getName(): String? {
            return self.name
        }
        pub fun getAvatar(): String? {
            return self.avatar
        }
        pub fun getCover(): String? {
            return self.cover
        }
        pub fun getColor(): String? {
            return self.color
        }
        pub fun getBio(): String? {
            return self.bio
        }
        pub fun getAuthorizations(): [AnyStruct{AuthenticationHookInterface}] {
            return self.authorizations
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
                if (self.authorizations[i].getId() == id) {
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
                if (self.authorizations[i].getId() == authorization.getId()) {
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

    access(self) fun mintIdentity(address: Address, name: String?, avatar: String?, cover: String?, color: String?, bio: String?, authorizations: [AnyStruct{AuthenticationHookInterface}]?): @Identity {
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
 