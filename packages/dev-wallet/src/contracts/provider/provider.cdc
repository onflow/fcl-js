pub contract ProviderContract {

    pub resource interface ProviderInterface {
        pub pid: String
        pub authn: String
        pub label: String
        pub icon: String
    }   

    pub resource Provider: ProviderInterface {
        pub var pid: String
        pub var authn: String
        pub var label: String
        pub var icon: String

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
    } 

    // Map from PID to Address
    pub var providers: {String: Address}

    // The init() function is required if the contract contains any fields.
    init() {
        self.providers = {}
    }

    pub fun mintProvider(addr: Address, pid: String, authn: String, label: String, icon: String): @Provider {
        self.providers[pid] = addr
        return <- create Provider(pid: pid, authn: authn, label: label, icon: icon)
    }

    pub fun mintProviderAndSaveAndLink(account: AuthAccount, addr: Address, pid: String, authn: String, label: String, icon: String) {
        let provider: @Provider <- self.mintProvider(addr: addr, pid: pid, authn: authn, label: label, icon: icon)
        account.save(<-provider, to: /storage/Provider)
        account.link<&ProviderContract.Provider{ProviderContract.ProviderInterface}>(/public/Provider, target: /storage/Provider)
    }

    pub fun getProviders(): {String: &{ProviderInterface}} {
        let providers: {String: &{ProviderInterface}} = {}
        for providerId in self.providers.keys {
            let providerAddress: Address = self.providers[providerId]!
            let ProviderInterfaceCapability = getAccount(providerAddress).getCapability(/public/Provider)!
            let ProviderInterfaceRef = ProviderInterfaceCapability.borrow<&Provider{ProviderInterface}>()! as &Provider{ProviderInterface}
            providers[providerId] = ProviderInterfaceRef
        }
        return providers
    }

    pub fun getProvider(pid: String): &{ProviderInterface} {
        let providerAddress: Address = self.providers[pid]!
        let ProviderInterfaceCapability = getAccount(providerAddress).getCapability(/public/Provider)!
        let ProviderInterfaceRef = ProviderInterfaceCapability.borrow<&Provider{ProviderInterface}>()! as &Provider{ProviderInterface}
        return ProviderInterfaceRef
    }
}
