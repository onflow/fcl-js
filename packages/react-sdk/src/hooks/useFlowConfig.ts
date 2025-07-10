import {useContext} from "react"
import {FlowConfigContext, FlowConfig} from "../core/context"

export function useFlowConfig(): FlowConfig {
  return useContext(FlowConfigContext)
}
