import {useFlowEvents, useFlowConfig} from "@onflow/react-sdk"
import {useState, useCallback} from "react"
import type {Event} from "@onflow/typedefs"
import {getEventType} from "../../constants"
import {DemoCard} from "../ui/demo-card"
import {useDarkMode} from "../flow-provider-wrapper"
import {PlusGridIcon} from "../ui/plus-grid"
import {ResultsSection} from "../ui/results-section"

const IMPLEMENTATION_CODE = `const { 
  data: events, 
  isLoading, 
  error 
} = useFlowEvents({
  eventType: "A.1654653399040a61.FlowToken.TokensWithdrawn",
  startBlockHeight: 0,
})`

export function UseFlowEventsCard() {
  const {darkMode} = useDarkMode()
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
    <DemoCard
      id="flow-events"
      title="useFlowEvents"
      description="Listen to blockchain events in real-time and filter by event types and block height ranges."
      code={IMPLEMENTATION_CODE}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Preset Event Types
          </label>
          <div className="flex flex-wrap gap-2">
            {presetEvents.map(preset => (
              <button
                key={preset.type}
                onClick={() => handleAddEventType(preset.type)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                darkMode
                    ? "bg-gray-800 text-gray-300 border-white/10 hover:bg-gray-700"
                    : "bg-white text-gray-700 border-black/10 hover:bg-gray-50"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Current Event Types
          </label>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(type => (
              <div
                key={type}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono ${
                darkMode
                    ? "bg-gray-800 text-gray-300 border border-white/10"
                    : "bg-gray-100 text-gray-700 border border-black/5"
                }`}
              >
                <span className="break-all">{type}</span>
                <button
                  onClick={() => handleRemoveEventType(type)}
                  className="text-red-500 hover:text-red-400 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            From Block (optional)
          </label>
          <input
            type="number"
            value={fromBlock}
            onChange={e => setFromBlock(e.target.value)}
            placeholder="Start block height"
            disabled={isListening}
            className={`w-full px-4 py-3 font-mono text-sm rounded-lg border outline-none transition-all
              duration-200 ${
              isListening
                  ? darkMode
                    ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
                  : darkMode
                    ? `bg-gray-900 text-white border-white/10 focus:border-flow-primary
                      placeholder-gray-600`
                    : `bg-white text-black border-black/10 focus:border-flow-primary
                      placeholder-gray-400`
              }`}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleStartListening}
            disabled={isListening || eventTypes.length === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isListening || eventTypes.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-flow-primary text-black hover:bg-flow-primary/80"
              }`}
          >
            {isListening ? "Listening..." : "Start Listening"}
          </button>

          <button
            onClick={handleStopListening}
            disabled={!isListening}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              !isListening
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
              }`}
          >
            Stop Listening
          </button>
        </div>

        <div
          className={`relative p-6 rounded-lg border min-h-[200px] ${
            darkMode
              ? "bg-gray-900/50 border-white/10"
              : "bg-gray-50 border-black/5"
            }`}
        >
          <PlusGridIcon placement="top left" className="absolute" />
          <h4
            className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Events
          </h4>

          {error && (
            <div
              className={`relative p-4 rounded-lg border ${
              darkMode
                  ? "bg-red-900/20 border-red-800/50"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <PlusGridIcon placement="top right" className="absolute" />
              <p
                className={`text-sm font-medium ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                Error: {error.message}
              </p>
            </div>
          )}

          {isListening && !error && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span
                className={`text-sm ${darkMode ? "text-green-400" : "text-green-600"}`}
              >
                Listening for events...
              </span>
            </div>
          )}

          {!isListening && events.length === 0 && !error && (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-5 5-5-5h5v-12"
                />
              </svg>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                No events received yet. Click "Start Listening" to begin.
              </p>
            </div>
          )}

          {events.length > 0 && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {events.map((event, index) => (
                <div
                  key={`${event.transactionId}-${event.eventIndex}-${index}`}
                  className={`relative p-4 rounded-lg border ${
                  darkMode
                      ? "bg-gray-800 border-white/10"
                      : "bg-white border-black/5"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-4">
                      <span
                        className={`text-sm font-mono font-medium block break-all ${
                        darkMode ? "text-white" : "text-black" }`}
                      >
                        {event.type}
                      </span>
                      <div
                        className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Block: {event.blockHeight} • Event #{event.eventIndex}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                      darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  <details className="mt-2">
                    <summary
                      className={`cursor-pointer text-xs font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600" }`}
                    >
                      Show Details
                    </summary>
                    <div
                      className={`mt-3 relative rounded-lg border ${
                      darkMode
                          ? "bg-gray-800 border-white/5"
                          : "bg-white border-black/5"
                      }`}
                    >
                      <div className="p-4 max-h-80 overflow-auto">
                        <pre
                          className={`text-xs font-mono whitespace-pre-wrap ${
                          darkMode ? "text-gray-300" : "text-gray-700" }`}
                        >
                          {JSON.stringify(event, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        <ResultsSection
          data={events}
          darkMode={darkMode}
          show={events.length > 0}
          title="Events Received"
        />
      </div>
    </DemoCard>
  )
}
