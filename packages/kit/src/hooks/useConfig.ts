import {useContext} from "react"
import {FlowConfigContext, FlowConfig} from "../core/context"

export function useConfig(): FlowConfig {
  return useContext(FlowConfigContext)
}
