import {useFlowConfig} from "@onflow/kit"

export function FlowConfigCard() {
  const config = useFlowConfig()

  return (
    <div className="p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">useFlowConfig</h2>
      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B]">
        <h4 className="text-black m-0 mb-4">Flow Configuration:</h4>

        {config && (
          <pre
            className="bg-white p-4 rounded border border-[#00EF8B] overflow-auto text-xs text-black
              m-0 whitespace-pre-wrap"
          >
            {JSON.stringify(config, null, 2)}
          </pre>
        )}

        {!config && (
          <p className="text-gray-500 m-0">No configuration available</p>
        )}
      </div>
    </div>
  )
}
