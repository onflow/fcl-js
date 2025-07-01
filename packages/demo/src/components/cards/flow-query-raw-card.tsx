import {useFlowQueryRaw} from "@onflow/kit"
import {useState} from "react"

export function FlowQueryRawCard() {
  const [cadenceScript, setCadenceScript] = useState(
    `
access(all) fun main(): String {
    return "Hello from Raw Query!"
}
`.trim()
  )

  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useFlowQueryRaw({
    cadence: cadenceScript,
    query: {enabled: false, staleTime: 10000},
  })

  const presetScripts = [
    {
      name: "Hello World",
      script: `access(all) fun main(): String {
    return "Hello from Raw Query!"
}`,
    },
    {
      name: "Current Block Info",
      script: `access(all) fun main(): [AnyStruct] {
    let block = getCurrentBlock()
    return [block.height, block.id, block.timestamp]
}`,
    },
    {
      name: "Multiple Values",
      script: `access(all) fun main(): {String: AnyStruct} {
    return {
        "timestamp": getCurrentBlock().timestamp,
        "height": getCurrentBlock().height,
        "random": revertibleRandom()
    }
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
        useFlowQueryRaw
      </h2>

      <div
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "#fff8e1",
          borderRadius: "6px",
          border: "1px solid #FFB800",
        }}
      >
        <p style={{color: "#000000", margin: "0", fontSize: "0.9rem"}}>
          <strong>Note:</strong> useFlowQueryRaw returns the raw FCL response
          without automatic parsing. This gives you access to the complete
          response structure including status, events, and raw data.
        </p>
      </div>

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
        >
          {isLoading ? "Executing..." : "Execute Script (Raw)"}
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
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>Raw Response:</h4>

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

        {result && !isLoading && !error && (
          <div>
            {(result as any).status && (
              <div style={{marginBottom: "1rem"}}>
                <h5 style={{color: "#000000", margin: "0 0 0.5rem 0"}}>
                  Status:
                </h5>
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    backgroundColor:
                      (result as any).status === "success"
                        ? "#d4edda"
                        : "#f8d7da",
                    border: `1px solid ${(result as any).status === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                    borderRadius: "4px",
                    color:
                      (result as any).status === "success"
                        ? "#155724"
                        : "#721c24",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  {(result as any).status}
                </div>
              </div>
            )}
            <details>
              <summary
                style={{
                  color: "#000000",
                  cursor: "pointer",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                }}
              >
                Full Raw Response
              </summary>
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
                  maxHeight: "400px",
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {!result && !isLoading && !error && (
          <p style={{color: "#666666", margin: "0"}}>
            Click "Execute Script (Raw)" to run the Cadence script and see the
            raw response
          </p>
        )}
      </div>
    </div>
  )
}
