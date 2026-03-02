export type ChatHistoryItem = {
  role: 'user' | 'assistant'
  content: string
}

export type BungRef = {
  type: 'id' | 'name' | 'index' | 'deictic'
  value: string | number
}

export type ConversationBungEntity = {
  bungId: string
  name: string
  currentMemberCount?: number
  status?: string
  order?: number
}

export type ConversationState = {
  entities?: {
    bungs?: ConversationBungEntity[]
  }
  focus?: {
    lastBungId?: string | null
  }
  lastReadResult?: {
    type?: string
    scope?: 'active' | 'all'
    bungId?: string
    challengeId?: number
    challengeName?: string
    count?: number
    total?: number
    timestamp?: string
  }
  pendingClarification?: {
    id?: string
    question?: string
    candidateLanes?: Array<'chat' | 'qa' | 'read' | 'action'>
    createdAt?: string
    resolved?: boolean
  }
}

export type ConversationStatePatch = Partial<ConversationState>

export type ChatActionNavigation = {
  type: 'route' | 'modal'
  modalKey?: string
  href?: string
  prefill?: Record<string, unknown>
}

export type ChatActionProposal = {
  actionKey: string
  summary: string
  params: Record<string, unknown> & {
    bungRef?: BungRef
  }
  missingFields: string[]
  dangerLevel: 'low' | 'high'
  confidence?: number
  navigation?: ChatActionNavigation
}

export type ChatAssistantKind =
  | 'chat'
  | 'qa'
  | 'action_collect'
  | 'action_ready'
  | 'action_navigate'
  | 'action_unavailable'

export type ChatAssistantResponse = {
  kind: ChatAssistantKind
  lane?: 'chat' | 'qa' | 'read' | 'action'
  reply: string
  sources?: { source: string; content: string }[]
  proposal?: ChatActionProposal
  statePatch?: ConversationStatePatch
  uiHints?: {
    showSources: boolean
    showActionButtons: boolean
  }
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
