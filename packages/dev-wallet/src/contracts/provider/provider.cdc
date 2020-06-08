pub contract ProviderContract {

    pub event ProviderCreated(pid: String)

    pub resource interface ProviderInterface {
        pub fun getPid(): String
        pub fun getAuthn(): String
        pub fun getLabel(): String
        pub fun getIcon(): String
    }   

    pub resource Provider: ProviderInterface {
        access(self) var pid: String
        access(self) var authn: String
        access(self) var label: String
        access(self) var icon: String

        init(pid: String, authn: String, label: String, icon: String) {
            self.pid = pid
            self.authn = authn
            self.label = label
            self.icon = icon
        }

        pub fun setPid(pid: String): Void {
            self.pid = pid
        }
        pub fun setAuthn(authn: String): Void {
            self.authn = authn
        }
        pub fun setLabel(label: String): Void {
            self.label = label
        }
        pub fun setIcon(icon: String): Void {
            self.icon = icon
        }

        pub fun getPid(): String {
            return self.pid
        }
        pub fun getAuthn(): String {
            return self.authn
        }
        pub fun getLabel(): String {
            return self.label
        }
        pub fun getIcon(): String {
            return self.icon
        }
    }

    // Map from PID to Address
    access(self) var providers: {String: Address}

    init() {
        self.providers = {}

        log("Provider Contract Init")
    }

    access(self) fun mintProvider(addr: Address, pid: String, authn: String, label: String, icon: String): @Provider {
        self.providers[pid] = addr
        return <- create Provider(pid: pid, authn: authn, label: label, icon: icon)
    }

    pub fun mintProviderAndSaveAndLink(account: AuthAccount, addr: Address, pid: String, authn: String, label: String, icon: String) {
        let provider: @Provider <- self.mintProvider(addr: addr, pid: pid, authn: authn, label: label, icon: icon)
        account.save(<-provider, to: /storage/Provider)
        account.link<&ProviderContract.Provider{ProviderContract.ProviderInterface}>(/public/Provider, target: /storage/Provider)
        emit ProviderCreated(pid: pid)
    }

    pub fun readProviders(): {String: &{ProviderInterface}} {
        let providers: {String: &{ProviderInterface}} = {}
        for providerId in self.providers.keys {
            let providerAddress: Address = self.providers[providerId]!
            let ProviderInterfaceCapability = getAccount(providerAddress).getCapability(/public/Provider)!
            let ProviderInterfaceRef = ProviderInterfaceCapability.borrow<&Provider{ProviderInterface}>()! as &Provider{ProviderInterface}
            providers[providerId] = ProviderInterfaceRef
        }
        return providers
    }

    pub fun readProvider(pid: String): &{ProviderInterface} {
        let providerAddress: Address = self.providers[pid]!
        let ProviderInterfaceCapability = getAccount(providerAddress).getCapability(/public/Provider)!
        let ProviderInterfaceRef = ProviderInterfaceCapability.borrow<&Provider{ProviderInterface}>()! as &Provider{ProviderInterface}
        return ProviderInterfaceRef
    }
}
