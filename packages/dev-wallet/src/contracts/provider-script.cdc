import ProviderContract from 0x01

pub fun main(): @ProviderContract.Provider {
    let p: @ProviderContract.Provider <- ProviderContract.createProvider(pid: "01", authn: "a", label: "b", icon: "c")
    return <- p
}
