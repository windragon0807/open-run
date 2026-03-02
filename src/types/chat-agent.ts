export type ChatHistoryItem = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatActionNavigation = {
  type: 'route' | 'modal'
  modalKey?: string
  href?: string
  prefill?: Record<string, unknown>
}

export type ChatActionProposal = {
  actionKey: string
  summary: string
  params: Record<string, unknown>
  missingFields: string[]
  dangerLevel: 'low' | 'high'
  confidence?: number
  navigation?: ChatActionNavigation
}

export type ChatAssistantKind =
  | 'qa'
  | 'action_collect'
  | 'action_ready'
  | 'action_navigate'
  | 'action_unavailable'

export type ChatAssistantResponse = {
  kind: ChatAssistantKind
  reply: string
  sources?: { source: string; content: string }[]
  proposal?: ChatActionProposal
}

export type ChatExecuteConfirmation = {
  approved: boolean
  phrase?: string
}

export type ChatExecuteRequiredInput = {
  key: string
  options: { id: string; label: string }[]
}

export type ChatExecuteStatus = 'success' | 'needs_input' | 'navigated' | 'failed'

export type ChatExecuteResponse = {
  status: ChatExecuteStatus
  message: string
  requiredInput?: ChatExecuteRequiredInput
  navigation?: ChatActionNavigation
  proposal?: ChatActionProposal
}
