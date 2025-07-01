import {useFlowConfig} from "@onflow/kit"

export function FlowConfigCard() {
  const config = useFlowConfig()

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
        useFlowConfig
      </h2>

      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          border: "1px solid #00EF8B",
        }}
      >
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>
          Flow Configuration:
        </h4>

        {config && (
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
            {JSON.stringify(config, null, 2)}
          </pre>
        )}

        {!config && (
          <p style={{color: "#666666", margin: "0"}}>
            No configuration available
          </p>
        )}
      </div>
    </div>
  )
}
