import {useFlowAccount, useFlowConfig} from "@onflow/kit"
import {useState} from "react"
import {CONTRACT_ADDRESSES} from "../../constants"

export function FlowAccountCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"

  // Use network-specific Flow Token contract address as default
  const [address, setAddress] = useState<string>(
    CONTRACT_ADDRESSES.FlowToken[currentNetwork]
  )

  const {
    data: account,
    isLoading,
    error,
    refetch,
  } = useFlowAccount({
    address,
    query: {enabled: false, staleTime: 30000},
  })

  // Generate preset addresses based on current network
  const presetAddresses = [
    {
      name: "Flow Token Contract",
      address: CONTRACT_ADDRESSES.FlowToken[currentNetwork],
    },
  ]

  return (
    <div
      style={{
        padding: "2rem",
        border: "2px solid #00EF8B",
        borderRadius: "12px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 6px rgba(0, 239, 139, 0.1)",
        marginBottom: "2rem",
      }}
    >
      <h2
        style={{
          color: "#000000",
          marginTop: "0",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
        }}
      >
        useFlowAccount
      </h2>

      <div style={{marginBottom: "1.5rem"}}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#000000",
            fontWeight: "500",
          }}
        >
          Preset Addresses:
        </label>
        <div style={{marginBottom: "1rem"}}>
          {presetAddresses.map(preset => (
            <button
              key={preset.address}
              onClick={() => setAddress(preset.address)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#f8f9fa",
                color: "#000000",
                border: "1px solid #00EF8B",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                marginBottom: "0.5rem",
                marginRight: "0.5rem",
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#000000",
            fontWeight: "500",
          }}
        >
          Account Address:
        </label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Enter Flow account address"
          style={{
            padding: "0.75rem",
            border: "2px solid #00EF8B",
            borderRadius: "6px",
            fontSize: "0.9rem",
            color: "#000000",
            backgroundColor: "#FFFFFF",
            outline: "none",
            transition: "border-color 0.2s ease",
            width: "100%",
            marginBottom: "1rem",
            fontFamily: "monospace",
          }}
        />

        <button
          onClick={() => refetch()}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: isLoading ? "#cccccc" : "#00EF8B",
            color: isLoading ? "#666666" : "#000000",
            border: "none",
            borderRadius: "6px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            marginRight: "1rem",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Fetch Account"}
        </button>
      </div>

      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          border: "1px solid #00EF8B",
        }}
      >
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>Account Data:</h4>

        {isLoading && (
          <p style={{color: "#666666", margin: "0"}}>Loading account data...</p>
        )}

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              color: "#721c24",
              margin: "0",
            }}
          >
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {account && !isLoading && !error && (
          <pre
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1rem",
              borderRadius: "4px",
              border: "1px solid #00EF8B",
              overflow: "auto",
              fontSize: "0.8rem",
              color: "#000000",
              margin: "0",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(account, null, 2)}
          </pre>
        )}

        {!account && !isLoading && !error && (
          <p style={{color: "#666666", margin: "0"}}>
            Click "Fetch Account" to load account data
          </p>
        )}
      </div>
    </div>
  )
}
