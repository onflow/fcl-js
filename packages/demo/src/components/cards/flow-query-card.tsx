import {useFlowQuery, useFlowConfig} from "@onflow/kit"
import {useState} from "react"
import {getContractAddress} from "../../constants"

export function FlowQueryCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"
  const [cadenceScript, setCadenceScript] = useState(
    `
access(all) fun main(): String {
    return "Hello, World!"
}
`.trim()
  )

  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useFlowQuery({
    cadence: cadenceScript,
    query: {enabled: false, staleTime: 10000},
  })

  const presetScripts = [
    {
      name: "Hello World",
      script: `access(all) fun main(): String {
    return "Hello, World!"
}`,
    },
    {
      name: "Current Block Height",
      script: `access(all) fun main(): UInt64 {
    return getCurrentBlock().height
}`,
    },
    {
      name: "Get Account Balance",
      script: `import FlowToken from ${getContractAddress("FlowToken", currentNetwork)}

access(all) fun main(address: Address): UFix64 {
    let account = getAccount(address)
    let vaultRef = account.capabilities.borrow<&FlowToken.Vault>(/public/flowTokenBalance)
    
    return vaultRef?.balance ?? 0.0
}`,
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
        useFlowQuery
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
          Preset Scripts:
        </label>
        <div style={{marginBottom: "1rem"}}>
          {presetScripts.map(preset => (
            <button
              key={preset.name}
              onClick={() => setCadenceScript(preset.script)}
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
          Cadence Script:
        </label>
        <textarea
          value={cadenceScript}
          onChange={e => setCadenceScript(e.target.value)}
          placeholder="Enter your Cadence script here..."
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
            minHeight: "120px",
            fontFamily: "monospace",
            resize: "vertical" as const,
            marginBottom: "1rem",
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
          onMouseOver={e => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = "#02D87E"
            }
          }}
          onMouseOut={e => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = "#00EF8B"
            }
          }}
        >
          {isLoading ? "Executing..." : "Execute Script"}
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
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>Script Result:</h4>

        {isLoading && (
          <p style={{color: "#666666", margin: "0"}}>Executing script...</p>
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

        {result !== null && result !== undefined && !isLoading && !error && (
          <pre
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1rem",
              borderRadius: "4px",
              border: "1px solid #00EF8B",
              overflow: "auto",
              fontSize: "0.9rem",
              color: "#000000",
              margin: "0",
              whiteSpace: "pre-wrap",
            }}
          >
            {typeof result === "string"
              ? result
              : JSON.stringify(result, null, 2)}
          </pre>
        )}

        {result === null && !isLoading && !error && (
          <p style={{color: "#666666", margin: "0"}}>
            Click "Execute Script" to run the Cadence script
          </p>
        )}
      </div>
    </div>
  )
}
