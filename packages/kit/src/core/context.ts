import {createContext} from "react"

export type FlowConfig = Record<string, unknown>

export const FlowConfigContext = createContext<FlowConfig>({})
