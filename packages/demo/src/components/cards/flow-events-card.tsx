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
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">useFlowEvents</h2>
      <div className="mb-6">
        <label className="block mb-2 text-black font-medium">
          Preset Event Types:
        </label>
        <div className="mb-4">
          {presetEvents.map(preset => (
            <button
              key={preset.type}
              onClick={() => handleAddEventType(preset.type)}
              className="py-3 px-6 bg-[#f8f9fa] text-black border border-[#00EF8B] rounded-md
                cursor-pointer font-semibold text-base transition-all duration-200 ease-in-out
                mb-2 mr-2"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <label className="block mb-2 text-black font-medium">
          Current Event Types:
        </label>
        <div className="mb-4">
          {eventTypes.map(type => (
            <div
              key={type}
              className="inline-flex items-center gap-2 py-2 px-4 bg-gray-200 rounded-md mb-2 mr-2
                text-xs text-black font-mono"
            >
              {type}
              <button
                onClick={() => handleRemoveEventType(type)}
                className="bg-none border-none text-red-500 cursor-pointer text-base p-0 ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 text-black font-medium">
              From Block (optional):
            </label>
            <input
              type="number"
              value={fromBlock}
              onChange={e => setFromBlock(e.target.value)}
              placeholder="Start block height"
              disabled={isListening}
              className={`p-3 border-2 border-[#00EF8B] rounded-md text-sm w-full font-mono
                transition-colors duration-200 ease-in-out ${
                isListening
                    ? "bg-gray-100 text-gray-500"
                    : "bg-white text-black"
                }`}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleStartListening}
            disabled={isListening || eventTypes.length === 0}
            className={`py-3 px-6 text-base font-semibold rounded-md transition-all duration-200
              ease-in-out ${
              isListening || eventTypes.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#00EF8B] text-black cursor-pointer"
              }`}
          >
            {isListening ? "Listening..." : "Start Listening"}
          </button>

          <button
            onClick={handleStopListening}
            disabled={!isListening}
            className={`py-3 px-6 text-base font-semibold rounded-md transition-all duration-200
              ease-in-out ${
              !isListening
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 text-white cursor-pointer"
              }`}
          >
            Stop Listening
          </button>
        </div>
      </div>

      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Events:</h4>

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded text-red-800 m-0">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {isListening && !error && (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span>Listening for events...</span>
          </div>
        )}

        {!isListening && events.length === 0 && !error && (
          <p className="text-gray-500 m-0">
            No events received yet. Click "Start Listening" to begin.
          </p>
        )}

        {events.length > 0 && (
          <div className="overflow-y-auto max-h-96">
            {events.map((event, index) => (
              <div
                key={`${event.transactionId}-${event.eventIndex}-${index}`}
                className="mb-4 p-4 bg-white rounded-md border border-gray-200"
              >
                <strong className="text-sm font-mono break-all">
                  {event.type}
                </strong>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium text-gray-600">
                    Show Details
                  </summary>
                  <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto text-xs whitespace-pre-wrap">
                    {JSON.stringify(event, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
