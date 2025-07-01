import {useFlowEvents, useFlowConfig} from "@onflow/kit"
import {useState, useCallback} from "react"
import type {Event} from "@onflow/typedefs"
import {getEventType} from "../../constants"

export function FlowEventsCard() {
  const config = useFlowConfig()
  const currentNetwork = config.flowNetwork || "emulator"

  const [eventTypes, setEventTypes] = useState([
    getEventType("FlowToken", "TokensWithdrawn", currentNetwork),
  ])
  const [fromBlock, setFromBlock] = useState<string>("")
  const [isListening, setIsListening] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<Error | null>(null)

  const onEvent = useCallback(
    (event: Event) => {
      if (isListening) {
        setEvents(prev => [event, ...prev].slice(0, 50)) // Keep last 50 events
      }
    },
    [isListening]
  )

  const onError = useCallback((err: Error) => {
    setError(err)
    setIsListening(false)
  }, [])

  // Always use the hook, but pass empty eventTypes when not listening
  useFlowEvents({
    eventTypes: isListening ? eventTypes : [],
    startHeight: isListening && fromBlock ? parseInt(fromBlock) : undefined,
    onEvent,
    onError,
  })

  const presetEvents = [
    {
      name: "FlowToken Withdrawn",
      type: getEventType("FlowToken", "TokensWithdrawn", currentNetwork),
    },
    {
      name: "FlowToken Deposited",
      type: getEventType("FlowToken", "TokensDeposited", currentNetwork),
    },
  ]

  const handleStartListening = () => {
    setEvents([])
    setError(null)
    setIsListening(true)
  }

  const handleStopListening = () => {
    setIsListening(false)
  }

  const handleAddEventType = (type: string) => {
    if (!eventTypes.includes(type)) {
      setEventTypes(prev => [...prev, type])
    }
  }

  const handleRemoveEventType = (type: string) => {
    setEventTypes(prev => prev.filter(t => t !== type))
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
        useFlowEvents
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
          Preset Event Types:
        </label>
        <div style={{marginBottom: "1rem"}}>
          {presetEvents.map(preset => (
            <button
              key={preset.type}
              onClick={() => handleAddEventType(preset.type)}
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
          Current Event Types:
        </label>
        <div style={{marginBottom: "1rem"}}>
          {eventTypes.map(type => (
            <div
              key={type}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#e9ecef",
                borderRadius: "6px",
                marginBottom: "0.5rem",
                marginRight: "0.5rem",
                fontSize: "0.8rem",
                color: "#000000",
                fontFamily: "monospace",
              }}
            >
              {type}
              <button
                onClick={() => handleRemoveEventType(type)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FF6B6B",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0",
                  marginLeft: "0.25rem",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div style={{display: "flex", gap: "1rem", marginBottom: "1rem"}}>
          <div style={{flex: 1}}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#000000",
                fontWeight: "500",
              }}
            >
              From Block (optional):
            </label>
            <input
              type="number"
              value={fromBlock}
              onChange={e => setFromBlock(e.target.value)}
              placeholder="Start block height"
              disabled={isListening}
              style={{
                padding: "0.75rem",
                border: "2px solid #00EF8B",
                borderRadius: "6px",
                fontSize: "0.9rem",
                color: "#000000",
                backgroundColor: isListening ? "#f8f9fa" : "#FFFFFF",
                outline: "none",
                transition: "border-color 0.2s ease",
                width: "100%",
                marginBottom: "1rem",
                fontFamily: "monospace",
              }}
            />
          </div>
        </div>

        <div style={{display: "flex", gap: "1rem"}}>
          <button
            onClick={handleStartListening}
            disabled={isListening || eventTypes.length === 0}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor:
                isListening || eventTypes.length === 0 ? "#cccccc" : "#00EF8B",
              color:
                isListening || eventTypes.length === 0 ? "#666666" : "#000000",
              border: "none",
              borderRadius: "6px",
              cursor:
                isListening || eventTypes.length === 0
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
            }}
          >
            {isListening ? "Listening..." : "Start Listening"}
          </button>

          <button
            onClick={handleStopListening}
            disabled={!isListening}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: !isListening ? "#cccccc" : "#FF6B6B",
              color: !isListening ? "#666666" : "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              cursor: !isListening ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
            }}
          >
            Stop Listening
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          border: "1px solid #00EF8B",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{color: "#000000", margin: "0"}}>
            Events ({events.length})
          </h4>
          {events.length > 0 && (
            <button
              onClick={() => setEvents([])}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc3545",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              color: "#721c24",
              marginBottom: "1rem",
            }}
          >
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {events.length === 0 && !error && (
          <p style={{color: "#666666", margin: "0"}}>
            {isListening
              ? "Listening for events..."
              : "Start listening to see events here"}
          </p>
        )}

        {events.length > 0 && (
          <div style={{maxHeight: "400px", overflow: "auto"}}>
            {events.map((event, index) => (
              <div
                key={`${event.blockId}-${event.transactionIndex}-${event.eventIndex}`}
                style={{
                  padding: "1rem",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #00EF8B",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                  fontSize: "0.8rem",
                  color: "#000000",
                }}
              >
                <div style={{marginBottom: "0.5rem"}}>
                  <strong>{event.type}</strong>
                  <span style={{color: "#666666", marginLeft: "1rem"}}>
                    Block: {event.blockHeight} | Tx: {event.transactionIndex}
                  </span>
                </div>
                <pre
                  style={{
                    margin: "0",
                    fontSize: "0.7rem",
                    color: "#666666",
                    whiteSpace: "pre-wrap",
                    backgroundColor: "#f8f9fa",
                    padding: "0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
