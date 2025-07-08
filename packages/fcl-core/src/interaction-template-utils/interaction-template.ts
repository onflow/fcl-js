export interface ImportItem {
  contractName: string
  address: string
  contract: string
}

export interface InteractionTemplateI18n {
  tag: string
  translation: string
}

export interface InteractionTemplateMessage {
  key: string
  i18n: InteractionTemplateI18n[]
}

export interface InteractionTemplateParameter {
  label: string
  index: number
  type: string
  balance?: string
  messages: InteractionTemplateMessage[]
}

export interface InteractionTemplateNetwork {
  network: string
  address: string
  dependency_pin?: string
  dependency_pin_block_height?: number
}

export interface InteractionTemplateContract {
  contract: string
  networks: InteractionTemplateNetwork[]
}

export interface InteractionTemplateDependency {
  contracts: InteractionTemplateContract[]
}

export interface InteractionTemplateCadence {
  body: string
}

// Version 1.0.0 specific types
export interface InteractionTemplateData100 {
  type: string
  interface: string
  messages: Record<string, {i18n: Record<string, string>}>
  cadence: string
  dependencies: Record<
    string,
    Record<
      string,
      Record<
        string,
        {
          address: string
          contract: string
          fq_address: string
          pin: string
          pin_block_height: number
        }
      >
    >
  >
  arguments: Record<
    string,
    {
      index: number
      type: string
      balance?: string
      messages: Record<string, {i18n: Record<string, string>}>
    }
  >
}

// Version 1.1.0 specific types
export interface InteractionTemplateData110 {
  type: string
  interface: string
  messages: InteractionTemplateMessage[]
  cadence: InteractionTemplateCadence
  dependencies: InteractionTemplateDependency[]
  parameters: InteractionTemplateParameter[]
}

export interface InteractionTemplate100 {
  f_type: "InteractionTemplate"
  f_version: "1.0.0"
  id: string
  data: InteractionTemplateData100
}

export interface InteractionTemplate110 {
  f_type: "InteractionTemplate"
  f_version: "1.1.0"
  id: string
  data: InteractionTemplateData110
}

export type InteractionTemplate =
  | InteractionTemplate100
  | InteractionTemplate110

// Utility types for function parameters
export interface GenerateTemplateIdParams {
  template: InteractionTemplate
}

export interface GetInteractionTemplateAuditsParams {
  template: InteractionTemplate
  auditors?: string[]
}

export interface GetInteractionTemplateAuditsOpts {
  flowInteractionAuditContract?: string
}

export interface DeriveCadenceByNetworkParams {
  network: string
  template: InteractionTemplate
}

export interface GetTemplateMessageParams {
  localization?: string
  messageKey: string
  template: InteractionTemplate
}

export interface GetTemplateArgumentMessageParams {
  localization?: string
  argumentLabel: string
  messageKey: string
  template: InteractionTemplate
}

export interface GenerateDependencyPinParams {
  address: string
  contractName: string
  blockHeight: number
}

export interface VerifyDependencyPinsSameParams {
  template: InteractionTemplate
  blockHeight?: number
}
