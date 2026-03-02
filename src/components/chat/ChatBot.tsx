'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { useModal } from '@contexts/ModalProvider'
import Input from '@shared/Input'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import { BrokenXIcon } from '@components/icons/x'
import CreateBung, { CreateBungInitialDraft } from '@components/home/create-bung/CreateBung'
import {
  ChatActionNavigation,
  ChatActionProposal,
  ChatAssistantKind,
  ChatAssistantResponse,
  ChatExecuteConfirmation,
  ChatExecuteRequiredInput,
  ChatExecuteResponse,
  ChatHistoryItem,
  ConversationState,
  ConversationStatePatch,
} from '@type/chat-agent'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'

type Message = {
  id: string
  role: 'user' | 'bot'
  content: string
  variant?: 'welcome'
  quickPrompts?: string[]
  sources?: { source: string; content: string }[]
  isLoading?: boolean
  assistantKind?: ChatAssistantKind
  proposal?: ChatActionProposal
  requiredInput?: ChatExecuteRequiredInput
  confirmation?: ChatExecuteConfirmation
  actionDecision?: 'pending' | 'approved' | 'rejected'
  uiHints?: {
    showSources: boolean
    showActionButtons: boolean
  }
}

const CHAT_AGENT_ENABLED = true
const DANGER_CONFIRM_PHRASE = '실행합니다'
const CHAT_WELCOME_MESSAGE = '안녕하세요, OpenRun AI예요.'
const CHAT_WELCOME_CAPABILITIES = [
  '서비스/기능 사양 안내',
  '내 데이터 조회 (본인 정보만)',
  '페이지 이동/실행 요청',
]
const CHAT_WELCOME_PROMPTS = [
  '도전과제가 뭐야?',
  '지금 참여 중인 벙 이름 보여줘',
  '프로필 페이지로 이동시켜줘',
  '이 벙 완료해줘',
]

export default function ChatBot() {
  const router = useRouter()
  const { showModal } = useModal()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: CHAT_WELCOME_MESSAGE,
      variant: 'welcome',
      quickPrompts: CHAT_WELCOME_PROMPTS,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [pendingDangerProposal, setPendingDangerProposal] = useState<ChatActionProposal | null>(null)
  const [conversationState, setConversationState] = useState<ConversationState>({})
  const [showFabHint, setShowFabHint] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sheetRef = useRef<BottomSheetRef>(null)

  const isBusy = isLoading || isExecuting

  const handleCloseSheet = useCallback(() => {
    sheetRef.current?.close()
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setShowFabHint(false)
      return
    }

    try {
      if (localStorage.getItem('openrun_chat_fab_hint_seen') === '1') {
        return
      }
    } catch {
      // ignore storage access errors
    }

    setShowFabHint(true)
    const hideTimer = setTimeout(() => setShowFabHint(false), 2600)
    const markSeenTimer = setTimeout(() => {
      try {
        localStorage.setItem('openrun_chat_fab_hint_seen', '1')
      } catch {
        // ignore storage access errors
      }
    }, 300)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(markSeenTimer)
    }
  }, [isOpen])

  const latestPendingAction = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const message = messages[i]
      if (message.role === 'bot' && message.proposal) {
        return { proposal: message.proposal }
      }
    }
    return null
  }, [messages])

  const pendingActionCount = useMemo(() => {
    return messages.filter(
      (message) =>
        message.role === 'bot' &&
        message.proposal != null &&
        message.actionDecision === 'pending' &&
        message.uiHints?.showActionButtons === true,
    ).length
  }, [messages])

  const buildHistory = useCallback((): ChatHistoryItem[] => {
    return messages
      .filter((message) => !message.isLoading)
      .slice(-20)
      .map((message) => ({
        role: message.role === 'user' ? 'user' : 'assistant',
        content: message.content,
      }))
  }, [messages])

  const openNavigation = useCallback(
    (navigation?: ChatActionNavigation, proposal?: ChatActionProposal) => {
      if (!navigation) return

      if (navigation.type === 'route' && navigation.href) {
        setIsOpen(false)
        router.push(navigation.href)
        return
      }

      if (navigation.type === 'modal' && navigation.modalKey === MODAL_KEY.CREATE_BUNG) {
        const rawPrefill = (navigation.prefill ?? {}) as {
          initialStep?: 'create' | 'invitation'
          draft?: CreateBungInitialDraft
        }
        showModal({
          key: MODAL_KEY.CREATE_BUNG,
          component: <CreateBung initialStep={rawPrefill.initialStep} initialDraft={rawPrefill.draft} />,
        })
        setIsOpen(false)
        return
      }

      if (proposal?.actionKey === 'bung.create') {
        showModal({
          key: MODAL_KEY.CREATE_BUNG,
          component: <CreateBung initialStep='create' />,
        })
        setIsOpen(false)
      }
    },
    [router, showModal],
  )

  const appendBotMessage = useCallback((message: Omit<Message, 'id' | 'role'>) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}-${Math.random()}`,
        role: 'bot',
        ...message,
      },
    ])
  }, [])

  const appendUserMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}-${Math.random()}`,
        role: 'user',
        content,
      },
    ])
  }, [])

  const executeProposal = useCallback(
    async (proposal: ChatActionProposal, confirmation: ChatExecuteConfirmation) => {
      if (isExecuting) return
      setIsExecuting(true)

      try {
        const response = await fetch('/api/chat/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ proposal, confirmation }),
        })
        const data = (await response.json()) as ChatExecuteResponse

        if (!response.ok) {
          appendBotMessage({ content: data.message || '요청 실행 중 오류가 발생했습니다.' })
          return
        }

        if (data.status === 'needs_input' && data.requiredInput && data.proposal) {
          appendBotMessage({
            content: data.message,
            assistantKind: 'action_collect',
            proposal: data.proposal,
            requiredInput: data.requiredInput,
            confirmation,
          })
          return
        }

        appendBotMessage({
          content: data.message,
          assistantKind: data.status === 'failed' ? 'action_collect' : 'action_ready',
        })

        if (data.status === 'navigated') {
          openNavigation(data.navigation, proposal)
        }
      } catch (error) {
        appendBotMessage({ content: '요청 실행 중 오류가 발생했습니다. 다시 시도해주세요.' })
      } finally {
        setIsExecuting(false)
      }
    },
    [appendBotMessage, isExecuting, openNavigation],
  )

  const sendMessageWithQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim()
    if (!question || isBusy) return

    if (pendingDangerProposal) {
      appendUserMessage(question)
      setInput('')

      const normalized = question.replace(/\s+/g, '')
      if (normalized === DANGER_CONFIRM_PHRASE.replace(/\s+/g, '')) {
        const proposal = pendingDangerProposal
        setPendingDangerProposal(null)
        await executeProposal(proposal, {
          approved: true,
          phrase: DANGER_CONFIRM_PHRASE,
        })
        return
      }

      if (['아니오', '취소', 'cancel', 'no'].includes(question.toLowerCase())) {
        setPendingDangerProposal(null)
        appendBotMessage({ content: '요청을 취소했어요. 필요하면 다시 말씀해 주세요.' })
        return
      }

      appendBotMessage({
        content: `위험 작업이라 확인 문구가 필요해요. \`${DANGER_CONFIRM_PHRASE}\`를 입력하거나 '취소'라고 입력해 주세요.`,
      })
      return
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
    }

    const loadingMsg: Message = {
      id: `bot-${Date.now()}`,
      role: 'bot',
      content: '',
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setInput('')
    setIsLoading(true)

    try {
      const requestBody = CHAT_AGENT_ENABLED
        ? {
            message: question,
            history: buildHistory(),
            pendingAction: latestPendingAction,
            conversationState,
          }
        : { question }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '응답을 받을 수 없습니다')
      }

      const nextBotMessage = normalizeChatResponse(data)
      if (nextBotMessage.statePatch) {
        setConversationState((prev) => mergeConversationState(prev, nextBotMessage.statePatch as ConversationStatePatch))
      }

      setMessages((prev) =>
        prev.map((message) =>
              message.id === loadingMsg.id
            ? {
                ...message,
                content: nextBotMessage.content,
                sources: nextBotMessage.sources,
                proposal: nextBotMessage.proposal,
                assistantKind: nextBotMessage.assistantKind,
                actionDecision: nextBotMessage.actionDecision,
                uiHints: nextBotMessage.uiHints,
                isLoading: false,
              }
            : message,
        ),
      )
    } catch (error) {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMsg.id
            ? { ...message, content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.', isLoading: false }
            : message,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    await sendMessageWithQuestion(input)
  }

  const handleActionDecision = useCallback(
    async (message: Message, approved: boolean) => {
      if (!message.proposal || isBusy) return

      const proposal = message.proposal
      setMessages((prev) => [
        ...prev.map((item) =>
          item.id === message.id
            ? {
                ...item,
                actionDecision: approved ? ('approved' as const) : ('rejected' as const),
              }
            : item,
        ),
        {
          id: `user-${Date.now()}-${Math.random()}`,
          role: 'user',
          content: approved ? '네' : '아니오',
        },
      ])

      if (!approved) {
        appendBotMessage({ content: '알겠습니다. 필요하면 다시 말씀해 주세요.' })
        return
      }

      if (proposal.dangerLevel === 'high') {
        setPendingDangerProposal(proposal)
        appendBotMessage({
          content: `확인했습니다. 위험 작업이라 확인 문구가 필요해요. \`${DANGER_CONFIRM_PHRASE}\`를 입력해 주세요.`,
        })
        return
      }

      await executeProposal(proposal, { approved: true })
    },
    [appendBotMessage, executeProposal, isBusy],
  )

  const handleRequiredInputSelect = useCallback(
    async (message: Message, option: { id: string; label: string }) => {
      if (!message.proposal || !message.requiredInput || !message.confirmation) return

      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}-${Math.random()}`,
          role: 'user',
          content: option.label,
        },
      ])

      const key = message.requiredInput.key
      const value = key === 'targetUserIds' ? [option.id] : option.id
      const updatedProposal: ChatActionProposal = {
        ...message.proposal,
        params: {
          ...message.proposal.params,
          [key]: value,
        },
        missingFields: message.proposal.missingFields.filter((field) => field !== key),
      }

      await executeProposal(updatedProposal, message.confirmation)
    },
    [executeProposal],
  )

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    void sendMessageWithQuestion(prompt)
  }

  return (
    <>
      {!isOpen && (
        <div
          className='fixed right-16 z-[998]'
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)',
          }}>
          <AnimatePresence>
            {showFabHint && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className='pointer-events-none absolute -top-44 right-0 flex items-center gap-6 rounded-20 bg-black-darken/90 px-10 py-6 text-11 font-medium text-white shadow-floating-primary'>
                <span className='h-6 w-6 rounded-full bg-secondary' />
                오픈런 도우미
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsOpen(true)}
            aria-label='오픈런 챗봇 열기'
            animate={{ scale: [1, 1.025, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            className='relative flex h-56 w-56 items-center justify-center rounded-full border border-white/90 bg-white/90 backdrop-blur-md active-press-duration active:scale-95 active:bg-white/95'
            style={{ boxShadow: '0 10px 24px rgba(16, 24, 40, 0.20), 0 1px 0 rgba(255,255,255,0.75) inset' }}>
            <span className='pointer-events-none absolute inset-[1px] rounded-full border border-black/5' />
            <span className='pointer-events-none absolute left-10 top-8 h-10 w-16 rounded-full bg-white/70 blur-[1px]' />
            <span className='relative z-10' style={{ filter: 'saturate(1.08)' }}>
              <OpenrunGradientChatIcon size={26} />
            </span>
            {pendingActionCount > 0 && (
              <span className='absolute -right-2 -top-2 flex h-22 min-w-22 items-center justify-center rounded-full border-2 border-white bg-secondary px-6 text-11 font-bold text-black-darken'>
                {pendingActionCount > 9 ? '9+' : pendingActionCount}
              </span>
            )}
          </motion.button>
        </div>
      )}

      {isOpen && (
        <Dimmed onClick={handleCloseSheet}>
          <BottomSheet
            ref={sheetRef}
            onClose={() => setIsOpen(false)}
            className='z-[1000] left-0 right-0 mx-auto flex h-[85dvh] w-full max-w-tablet flex-col overflow-hidden rounded-t-2xl bg-gray-lighten'>
            <div className='relative flex items-center justify-center border-b border-primary/15 bg-white/70 px-20 py-16 backdrop-blur-md'>
              <p className='text-16 font-bold text-black-darken'>OpenRun AI</p>
              <button
                onClick={handleCloseSheet}
                className='absolute right-16 top-1/2 -translate-y-1/2 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'>
                <BrokenXIcon size={24} color={colors.black.DEFAULT} />
              </button>
            </div>

            <div className='relative flex-1 overflow-y-auto px-16 py-12 scrollbar-hide'>
              <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(79,95,255,0.10),rgba(79,95,255,0.00)_60%)]' />
              <div className='pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl' />
              <div className='relative'>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    disabled={isBusy}
                    onActionDecision={handleActionDecision}
                    onSelectRequiredInput={handleRequiredInputSelect}
                    onQuickPrompt={handleQuickPrompt}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className='border-t border-gray/30 px-16 pt-12 pb-[max(24px,env(safe-area-inset-bottom,24px))] app:pb-[max(36px,env(safe-area-inset-bottom,36px))]'>
              <div className='flex items-center gap-8'>
                <Input
                  ref={inputRef}
                  value={input}
                  setValue={setInput}
                  onKeyDown={handleKeyDown}
                  placeholder={CHAT_AGENT_ENABLED ? '질문 또는 실행 요청을 입력하세요...' : '질문을 입력하세요...'}
                  disabled={isBusy}
                  className='h-44 flex-1 rounded-22 bg-white px-16 text-14 text-black-darken placeholder:text-gray-darken disabled:opacity-50'
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isBusy}
                  className='flex h-44 w-44 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white active-press-duration active:scale-90 active:bg-primary-darken disabled:bg-gray disabled:text-gray-lighten'>
                  <SendIcon />
                </button>
              </div>
            </div>
          </BottomSheet>
        </Dimmed>
      )}
    </>
  )
}

function normalizeChatResponse(data: unknown): {
  content: string
  sources?: { source: string; content: string }[]
  proposal?: ChatActionProposal
  assistantKind?: ChatAssistantKind
  actionDecision?: 'pending' | 'approved' | 'rejected'
  statePatch?: ConversationStatePatch
  uiHints?: {
    showSources: boolean
    showActionButtons: boolean
  }
} {
  if (isAssistantResponse(data)) {
    const uiHints = data.uiHints ?? {
      showSources: data.kind === 'qa' && !!(data.sources && data.sources.length > 0),
      showActionButtons: !!data.proposal && !data.proposal.actionKey.startsWith('read.'),
    }
    const shouldAskDecision =
      data.proposal != null &&
      uiHints.showActionButtons &&
      (data.kind === 'action_collect' ||
        data.kind === 'action_ready' ||
        data.kind === 'action_navigate' ||
        data.kind === 'action_unavailable')

    return {
      content: shouldAskDecision ? buildActionAskMessage(data.proposal as ChatActionProposal) : data.reply,
      sources: data.sources,
      proposal: data.proposal,
      assistantKind: data.kind,
      actionDecision: shouldAskDecision ? 'pending' : undefined,
      statePatch: data.statePatch,
      uiHints,
    }
  }

  if (isLegacyResponse(data)) {
    return {
      content: data.answer,
      sources: data.sources,
      assistantKind: 'qa',
      uiHints: {
        showSources: !!(data.sources && data.sources.length > 0),
        showActionButtons: false,
      },
    }
  }

  return {
    content: '응답 형식을 해석하지 못했습니다. 다시 시도해주세요.',
    assistantKind: 'qa',
  }
}

function buildActionAskMessage(proposal: ChatActionProposal): string {
  return `네, 제가 도와드릴 수 있어요!\n${buildActionQuestion(proposal)}`
}

function mergeConversationState(base: ConversationState, patch: ConversationStatePatch): ConversationState {
  return {
    entities: {
      ...base.entities,
      ...patch.entities,
      bungs: patch.entities?.bungs ?? base.entities?.bungs,
    },
    focus: {
      ...base.focus,
      ...patch.focus,
    },
    lastReadResult: {
      ...base.lastReadResult,
      ...patch.lastReadResult,
    },
    pendingClarification: {
      ...base.pendingClarification,
      ...patch.pendingClarification,
    },
  }
}

function buildActionQuestion(proposal: ChatActionProposal): string {
  switch (proposal.actionKey) {
    case 'bung.create':
      return '벙 만들기 페이지로 이동할까요?'
    case 'challenge.open_page':
      return '도전과제 페이지로 이동할까요?'
    case 'challenge.progress.open_page':
      return '진행 중 도전과제 페이지로 이동할까요?'
    case 'challenge.general.open_page':
      return '일반 도전과제 페이지로 이동할까요?'
    case 'challenge.repetitive.open_page':
      return '반복 도전과제 페이지로 이동할까요?'
    case 'challenge.completed.open_page':
      return '완료 도전과제 페이지로 이동할까요?'
    case 'home.open_page':
      return '홈 화면으로 이동할까요?'
    case 'avatar.open_page':
      return '아바타 페이지로 이동할까요?'
    case 'profile.open_page':
      return '프로필 페이지로 이동할까요?'
    case 'profile.modify.open_page':
      return '프로필 정보 수정 페이지로 이동할까요?'
    case 'profile.notification.open_page':
      return '알림 설정 페이지로 이동할까요?'
    case 'explore.open_page':
      return '벙 탐색 페이지로 이동할까요?'
    case 'bung.search.open_page':
      return '벙 검색 페이지로 이동할까요?'
    case 'bung.detail.open_page':
      return '벙 상세 페이지로 이동할까요?'
    case 'bung.manage_members.open_page':
      return '멤버 관리 페이지로 이동할까요?'
    case 'bung.delegate_owner.open_page':
      return '벙주 위임 페이지로 이동할까요?'
    case 'auth.signin.open_page':
      return '로그인 페이지로 이동할까요?'
    case 'auth.register.open_page':
      return '회원가입 페이지로 이동할까요?'
    case 'bung.modify':
      return '벙 수정 화면으로 이동해서 도와드릴까요?'
    case 'bung.invite_members':
      return '초대 화면으로 이동해서 안내해드릴까요?'
    case 'bung.complete':
      return '벙 완료를 진행할까요?'
    case 'bung.join':
      return '벙 참여를 진행할까요?'
    case 'bung.leave':
      return '벙 참여 취소를 진행할까요?'
    case 'bung.certify':
      return '참여 인증을 진행할까요?'
    case 'bung.delete':
      return '벙 삭제를 진행할까요?'
    case 'bung.delegate_owner':
      return '벙주 위임을 진행할까요?'
    case 'bung.kick_member':
      return '멤버 내보내기를 진행할까요?'
    case 'challenge.mint_nft':
      return '도전과제 보상 수령을 진행할까요?'
    case 'bung.send_feedback':
      return '좋아요 남기기를 진행할까요?'
    case 'user.delete_account':
      return '계정 탈퇴를 진행할까요?'
    default:
      return `${proposal.summary}를 진행할까요?`
  }
}

function isAssistantResponse(data: unknown): data is ChatAssistantResponse {
  if (!data || typeof data !== 'object') return false
  const raw = data as { kind?: unknown; reply?: unknown }
  return typeof raw.kind === 'string' && typeof raw.reply === 'string'
}

function isLegacyResponse(data: unknown): data is { answer: string; sources?: { source: string; content: string }[] } {
  if (!data || typeof data !== 'object') return false
  const raw = data as { answer?: unknown }
  return typeof raw.answer === 'string'
}

function MessageBubble({
  message,
  disabled,
  onActionDecision,
  onSelectRequiredInput,
  onQuickPrompt,
}: {
  message: Message
  disabled: boolean
  onActionDecision: (message: Message, approved: boolean) => void
  onSelectRequiredInput: (message: Message, option: { id: string; label: string }) => void
  onQuickPrompt: (prompt: string) => void
}) {
  const isBot = message.role === 'bot'
  const isWelcomeCard = isBot && message.variant === 'welcome'
  const canShowDecisionButtons =
    isBot &&
    message.proposal != null &&
    message.requiredInput == null &&
    message.actionDecision === 'pending' &&
    message.uiHints?.showActionButtons === true &&
    (message.assistantKind === 'action_collect' ||
      message.assistantKind === 'action_ready' ||
      message.assistantKind === 'action_navigate' ||
      (message.assistantKind === 'action_unavailable' && message.proposal.navigation != null))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={clsx('mb-12 flex', isBot ? 'justify-start' : 'justify-end')}>
      <div
        className={clsx(
          'max-w-[85%] rounded-16 px-14 py-10',
          isBot
            ? 'rounded-tl-4 border border-white/85 bg-white/92 text-black-darken shadow-[0_2px_10px_rgba(17,24,39,0.06)]'
            : 'rounded-tr-4 bg-primary text-white',
        )}>
        {message.isLoading ? (
          <LoadingDots />
        ) : (
          <>
            {isWelcomeCard ? (
              <div>
                <p className='text-14 font-semibold text-black-darken'>{message.content}</p>
                <p className='mt-6 text-12 font-medium text-gray-darker'>제가 도와드릴 수 있는 내용</p>
                <div className='mt-6 space-y-6'>
                  {CHAT_WELCOME_CAPABILITIES.map((item) => (
                    <div key={item} className='flex items-center gap-6'>
                      <span className='h-4 w-4 rounded-full bg-primary/75' />
                      <p className='text-12 leading-[1.45] text-black-darken'>{item}</p>
                    </div>
                  ))}
                </div>
                {message.quickPrompts && message.quickPrompts.length > 0 && (
                  <div className='mt-10 border-t border-primary/10 pt-8'>
                    <p className='text-12 font-medium text-gray-darker'>예시 질문</p>
                    <div className='mt-6 flex flex-wrap gap-4'>
                      {message.quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          className='rounded-10 border border-primary/20 bg-white/90 px-8 py-4 text-10 font-medium text-primary shadow-[0_1px_4px_rgba(79,95,255,0.10)] active-press-duration active:scale-98 active:bg-primary/5'
                          onClick={() => onQuickPrompt(prompt)}
                          disabled={disabled}>
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className='whitespace-pre-wrap text-14 leading-[1.6]'>{message.content}</p>
            )}

            {message.uiHints?.showSources && message.sources && message.sources.length > 0 && (
              <div className='mt-8 border-t border-gray/30 pt-6'>
                <p className='text-10 font-medium text-gray-darken'>참고 문서</p>
                <div className='mt-4 flex flex-wrap gap-4'>
                  {message.sources.map((source, index) => (
                    <span
                      key={index}
                      className='inline-block rounded-4 bg-gray-lighten px-6 py-2 text-10 text-gray-darker'>
                      {source.source.replace(/^\d+_/, '').replace(/\.md$/, '').replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {canShowDecisionButtons && message.proposal && (
              <div className='mt-10 flex gap-8'>
                <button
                  className='h-36 flex-1 rounded-8 bg-black-darken px-10 text-12 font-bold text-white active-press-duration active:scale-98 disabled:bg-gray-darken'
                  onClick={() => onActionDecision(message, true)}
                  disabled={disabled}>
                  네
                </button>
                <button
                  className='h-36 flex-1 rounded-8 bg-gray-lighten px-10 text-12 font-bold text-black-darken active-press-duration active:scale-98 disabled:opacity-50'
                  onClick={() => onActionDecision(message, false)}
                  disabled={disabled}>
                  아니오
                </button>
              </div>
            )}

            {message.requiredInput && message.proposal && (
              <div className='mt-10 flex flex-wrap gap-6'>
                {message.requiredInput.options.map((option) => (
                  <button
                    key={option.id}
                    className='rounded-12 border border-primary/30 bg-primary/10 px-10 py-6 text-12 font-bold text-primary active-press-duration active:scale-98 disabled:opacity-50'
                    onClick={() => onSelectRequiredInput(message, option)}
                    disabled={disabled}>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

function LoadingDots() {
  return (
    <div className='flex items-center gap-4 py-4'>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className='h-6 w-6 rounded-full bg-gray-darken'
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
        />
      ))}
    </div>
  )
}

function OpenrunChatIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path
        fill='white'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.7857 20H0V17.8667H14.7857C18.1126 17.8667 20.8095 15.2401 20.8095 12C20.8095 8.75993 18.1126 6.13333 14.7857 6.13333H9.30952C5.98267 6.13333 3.28571 8.75993 3.28571 12C3.28571 12.5547 3.36475 13.0914 3.51246 13.6H5.84508C5.60854 13.1151 5.47619 12.5726 5.47619 12C5.47619 9.93814 7.19243 8.26667 9.30952 8.26667H14.7857C16.9028 8.26667 18.619 9.93814 18.619 12C18.619 14.0619 16.9028 15.7333 14.7857 15.7333H2.04267C1.68358 15.0717 1.41695 14.3552 1.25955 13.6C1.1518 13.083 1.09524 12.5479 1.09524 12C1.09524 7.58172 4.7729 4 9.30952 4H14.7857C19.3223 4 23 7.58172 23 12C23 16.4183 19.3223 20 14.7857 20ZM14.7857 13.6H9.30952C8.4022 13.6 7.66667 12.8837 7.66667 12C7.66667 11.1163 8.4022 10.4 9.30952 10.4H14.7857C15.693 10.4 16.4286 11.1163 16.4286 12C16.4286 12.8837 15.693 13.6 14.7857 13.6Z'
      />
    </svg>
  )
}

function OpenrunGradientChatIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path
        fill={colors.primary.DEFAULT}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.7857 20H0V17.8667H14.7857C18.1126 17.8667 20.8095 15.2401 20.8095 12C20.8095 8.75993 18.1126 6.13333 14.7857 6.13333H9.30952C5.98267 6.13333 3.28571 8.75993 3.28571 12C3.28571 12.5547 3.36475 13.0914 3.51246 13.6H5.84508C5.60854 13.1151 5.47619 12.5726 5.47619 12C5.47619 9.93814 7.19243 8.26667 9.30952 8.26667H14.7857C16.9028 8.26667 18.619 9.93814 18.619 12C18.619 14.0619 16.9028 15.7333 14.7857 15.7333H2.04267C1.68358 15.0717 1.41695 14.3552 1.25955 13.6C1.1518 13.083 1.09524 12.5479 1.09524 12C1.09524 7.58172 4.7729 4 9.30952 4H14.7857C19.3223 4 23 7.58172 23 12C23 16.4183 19.3223 20 14.7857 20ZM14.7857 13.6H9.30952C8.4022 13.6 7.66667 12.8837 7.66667 12C7.66667 11.1163 8.4022 10.4 9.30952 10.4H14.7857C15.693 10.4 16.4286 11.1163 16.4286 12C16.4286 12.8837 15.693 13.6 14.7857 13.6Z'
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
      <path d='M3 20L22 12L3 4V10L17 12L3 14V20Z' fill='currentColor' />
    </svg>
  )
}
