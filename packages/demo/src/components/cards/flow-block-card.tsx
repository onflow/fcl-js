import {useFlowBlock} from "@onflow/kit"
import {useState} from "react"

export function FlowBlockCard() {
  const [blockHeight, setBlockHeight] = useState<string>("")
  const [blockId, setBlockId] = useState<string>("")
  const [useLatest, setUseLatest] = useState(true)

  const {
    data: block,
    isLoading,
    error,
    refetch,
  } = useFlowBlock({
    height: useLatest
      ? undefined
      : blockHeight
        ? parseInt(blockHeight)
        : undefined,
    id: useLatest ? undefined : blockId || undefined,
    query: {enabled: false, staleTime: 30000},
  })

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
        useFlowBlock
      </h2>

      <div style={{marginBottom: "1.5rem"}}>
        <div style={{marginBottom: "1rem"}}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              color: "#000000",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={useLatest}
              onChange={e => setUseLatest(e.target.checked)}
              style={{
                marginRight: "0.5rem",
                transform: "scale(1.2)",
              }}
            />
            Fetch Latest Block
          </label>
        </div>

        {!useLatest && (
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#000000",
                fontWeight: "500",
              }}
            >
              Block Height (optional):
            </label>
            <input
              type="number"
              value={blockHeight}
              onChange={e => setBlockHeight(e.target.value)}
              placeholder="Enter block height (e.g., 12345)"
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

            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#000000",
                fontWeight: "500",
              }}
            >
              Block ID (optional):
            </label>
            <input
              type="text"
              value={blockId}
              onChange={e => setBlockId(e.target.value)}
              placeholder="Enter block ID"
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
          </div>
        )}

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
          {isLoading
            ? "Loading..."
            : useLatest
              ? "Fetch Latest Block"
              : "Fetch Block"}
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
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>Block Data:</h4>

        {isLoading && (
          <p style={{color: "#666666", margin: "0"}}>Loading block data...</p>
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

        {block && !isLoading && !error && (
          <div>
            <div style={{marginBottom: "1rem"}}>
              <p style={{color: "#000000", margin: "0.25rem 0"}}>
                <strong>Height:</strong> {block.height}
              </p>
              <p style={{color: "#000000", margin: "0.25rem 0"}}>
                <strong>ID:</strong> {block.id}
              </p>
              <p style={{color: "#000000", margin: "0.25rem 0"}}>
                <strong>Parent ID:</strong> {block.parentId}
              </p>
              <p style={{color: "#000000", margin: "0.25rem 0"}}>
                <strong>Timestamp:</strong>{" "}
                {new Date(block.timestamp).toLocaleString()}
              </p>
            </div>
            <details>
              <summary
                style={{
                  color: "#000000",
                  cursor: "pointer",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                }}
              >
                Full Block Data
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
                }}
              >
                {JSON.stringify(block, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {!block && !isLoading && !error && (
          <p style={{color: "#666666", margin: "0"}}>
            Click "Fetch Block" to load block data
          </p>
        )}
      </div>
    </div>
  )
}
