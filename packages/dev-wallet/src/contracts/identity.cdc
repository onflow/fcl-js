pub contract IdentityContract {

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
        pub var name: String?
        pub var avatar: String?
        pub var cover: String?
        pub var color: String?
        pub var bio: String?
        pub var authorizations: [AnyStruct{AuthenticationHookInterface}]

        init(name: String?, avatar: String?, cover: String?, color: String?, bio: String?, authorizations: [AnyStruct{AuthenticationHookInterface}]?) {
            self.name = name
            self.avatar = avatar
            self.cover = cover
            self.color = color
            self.bio = bio
            self.authorizations = authorizations != nil ? authorizations! : []
        }

        pub fun setName(name: String): Void {
            self.name = name
        }
        pub fun setAvatar(avatar: String): Void {
            self.avatar = avatar
        }
        pub fun setCover(cover: String): Void {
            self.cover = cover
        }
        pub fun setColor(color: String): Void {
            self.color = color
        }
        pub fun setBio(bio: String): Void {
            self.bio = bio
        }
        pub fun addAuthorization(authorization: AnyStruct{AuthenticationHookInterface}): Void {
            self.updateAuthorization(authorization: authorization)
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
        }
    }

    pub fun createAuthenticationHook(id: String?, addr: String?, method: String?, endpoint: String?, data: {String:AnyStruct}?): AnyStruct{AuthenticationHookInterface} {
        return AuthenticationHook(id: id, addr: addr, method: method, endpoint: endpoint, data: data);
    }


    pub fun mintIdentity(name: String?, avatar: String?, cover: String?, color: String?, bio: String?, authorizations: [AnyStruct{AuthenticationHookInterface}]?): @Identity {
        return <- create Identity(name: name, avatar: avatar, cover: cover, color: color, bio: bio, authorizations: authorizations)
    }

    pub fun mintIdentityAndSaveAndLink(account: AuthAccount, name: String?, avatar: String?, cover: String?, color: String?, bio: String?, authorizations: [AnyStruct{AuthenticationHookInterface}]?) {
        let identity: @Identity <- self.mintIdentity(name: name, avatar: avatar, cover: cover, color: color, bio: bio, authorizations: authorizations)
        account.save(<-identity, to: /storage/Identity)
        account.link<&IdentityContract.Identity{IdentityContract.PublicIdentity}>(/public/Identity, target: /storage/Identity)
        log("Identity created and saved")
    }

    pub fun readPublicIdentity(addr: Address): AnyStruct {
        let IdentityInterfaceCapability = getAccount(addr).getCapability(/public/Identity)!
        let PublicIdentityeRef = IdentityInterfaceCapability.borrow<&Identity{PublicIdentity}>()!
        let publicIdentity = {
            "name": PublicIdentityeRef.name as AnyStruct,
            "avatar": PublicIdentityeRef.avatar as AnyStruct,
            "color": PublicIdentityeRef.color as AnyStruct,
            "cover": PublicIdentityeRef.cover as AnyStruct,
            "bio": PublicIdentityeRef.bio as AnyStruct,
            "authorizations": PublicIdentityeRef.authorizations as AnyStruct
        }
        return publicIdentity
    }

    init() {
        log("Identity Contract Init")
    }
}
 