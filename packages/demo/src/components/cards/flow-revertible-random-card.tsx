import {useFlowRevertibleRandom} from "@onflow/kit"

export function FlowRevertibleRandomCard() {
  const {
    data: randomResults,
    isLoading,
    error,
    refetch,
  } = useFlowRevertibleRandom({
    max: "1000000000",
    count: 3,
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
        useFlowRevertibleRandom
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
          <strong>Note:</strong> revertibleRandom() generates cryptographically
          secure random numbers on the Flow blockchain. These values are
          deterministic and can be used safely in smart contracts.
        </p>
      </div>

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
          {isLoading ? "Generating..." : "Generate Random Values"}
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
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>Random Values:</h4>

        {isLoading && (
          <p style={{color: "#666666", margin: "0"}}>
            Generating random values...
          </p>
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

        {randomResults && randomResults.length > 0 && !isLoading && !error && (
          <div>
            {randomResults.map((result, idx) => (
              <div
                key={idx}
                style={{
                  padding: "1rem",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #00EF8B",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h5
                    style={{
                      color: "#000000",
                      margin: "0",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    Random Value #{idx + 1}
                  </h5>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#666666",
                      fontFamily: "monospace",
                    }}
                  >
                    Block: {result.blockHeight}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#000000",
                    fontFamily: "monospace",
                    letterSpacing: "0.05em",
                    textAlign: "center",
                    padding: "0.5rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                  }}
                >
                  {result.value}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #00EF8B",
                      borderRadius: "4px",
                    }}
                  >
                    <h6
                      style={{
                        color: "#000000",
                        margin: "0 0 0.25rem 0",
                        fontSize: "0.8rem",
                      }}
                    >
                      Hexadecimal:
                    </h6>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.7rem",
                        color: "#000000",
                        wordBreak: "break-all",
                      }}
                    >
                      0x{BigInt(result.value).toString(16).toUpperCase()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #00EF8B",
                      borderRadius: "4px",
                    }}
                  >
                    <h6
                      style={{
                        color: "#000000",
                        margin: "0 0 0.25rem 0",
                        fontSize: "0.8rem",
                      }}
                    >
                      Binary (truncated):
                    </h6>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.6rem",
                        color: "#000000",
                        wordBreak: "break-all",
                        maxHeight: "2rem",
                        overflow: "hidden",
                      }}
                    >
                      {BigInt(result.value).toString(2).slice(0, 32)}...
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                backgroundColor: "#e8f5e8",
                border: "1px solid #00EF8B",
                borderRadius: "4px",
                fontSize: "0.8rem",
                color: "#000000",
              }}
            >
              <strong>Usage in Cadence:</strong>{" "}
              <code style={{fontFamily: "monospace"}}>
                revertibleRandom(modulo: UInt256)
              </code>
            </div>
          </div>
        )}

        {(!randomResults || randomResults.length === 0) &&
          !isLoading &&
          !error && (
            <p style={{color: "#666666", margin: "0"}}>
              Click "Generate Random Values" to get cryptographically secure
              random numbers
            </p>
          )}
      </div>
    </div>
  )
}
