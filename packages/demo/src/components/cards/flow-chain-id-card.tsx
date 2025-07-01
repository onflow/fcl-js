import {useFlowChainId} from "@onflow/kit"

export function FlowChainIdCard() {
  const {
    data: chainId,
    isLoading,
    error,
    refetch,
  } = useFlowChainId({
    query: {enabled: false, staleTime: 300000}, // 5 minutes cache
  })

  const getChainName = (id: string) => {
    switch (id) {
      case "flow-mainnet":
        return "Flow Mainnet"
      case "flow-testnet":
        return "Flow Testnet"
      case "flow-emulator":
        return "Flow Emulator"
      case "flow-canarynet":
        return "Flow Canarynet"
      default:
        return "Unknown Chain"
    }
  }

  const getChainColor = (id: string) => {
    switch (id) {
      case "flow-mainnet":
        return "#00EF8B"
      case "flow-testnet":
        return "#FFB800"
      case "flow-emulator":
        return "#9945FF"
      case "flow-canarynet":
        return "#FF6B6B"
      default:
        return "#666666"
    }
  }

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
        useFlowChainId
      </h2>

      <div style={{marginBottom: "1.5rem"}}>
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
          {isLoading ? "Loading..." : "Fetch Chain ID"}
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
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>
          Chain Information:
        </h4>

        {isLoading && (
          <p style={{color: "#666666", margin: "0"}}>Loading chain ID...</p>
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

        {chainId && !isLoading && !error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: getChainColor(chainId),
                }}
              />
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#000000",
                }}
              >
                {getChainName(chainId)}
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #00EF8B",
                fontFamily: "monospace",
                fontSize: "0.9rem",
                color: "#000000",
              }}
            >
              {chainId}
            </div>
          </div>
        )}

        {!chainId && !isLoading && !error && (
          <p style={{color: "#666666", margin: "0"}}>
            Click "Fetch Chain ID" to load current chain information
          </p>
        )}
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          backgroundColor: "#fff8e1",
          borderRadius: "6px",
          border: "1px solid #FFB800",
        }}
      >
        <h5 style={{color: "#000000", margin: "0 0 0.5rem 0"}}>Chain Types:</h5>
        <ul style={{color: "#666666", margin: "0", paddingLeft: "1.5rem"}}>
          <li>
            <strong>flow-mainnet:</strong> Production network
          </li>
          <li>
            <strong>flow-testnet:</strong> Testing network
          </li>
          <li>
            <strong>flow-emulator:</strong> Local development
          </li>
          <li>
            <strong>flow-canarynet:</strong> Canary releases
          </li>
        </ul>
      </div>
    </div>
  )
}
