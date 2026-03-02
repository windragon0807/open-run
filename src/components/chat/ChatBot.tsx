'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { useModal } from '@contexts/ModalProvider'
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
} from '@type/chat-agent'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'

type Message = {
  id: string
  role: 'user' | 'bot'
  content: string
  sources?: { source: string; content: string }[]
  isLoading?: boolean
  assistantKind?: ChatAssistantKind
  proposal?: ChatActionProposal
  requiredInput?: ChatExecuteRequiredInput
  confirmation?: ChatExecuteConfirmation
}

const CHAT_AGENT_ENABLED = true
const DANGER_CONFIRM_PHRASE = '실행합니다'

export default function ChatBot() {
  const router = useRouter()
  const { showModal } = useModal()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: '안녕하세요! 오픈런에 대해 궁금한 점을 물어보세요 🏃‍♂️',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<ChatActionProposal | null>(null)
  const [confirmPhrase, setConfirmPhrase] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isBusy = isLoading || isExecuting

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

  const latestPendingAction = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const message = messages[i]
      if (message.role === 'bot' && message.proposal) {
        return { proposal: message.proposal }
      }
    }
    return null
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
        return
      }

      if (proposal?.actionKey === 'bung.create') {
        showModal({
          key: MODAL_KEY.CREATE_BUNG,
          component: <CreateBung initialStep='create' />,
        })
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
          proposal: data.proposal,
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

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || isBusy) return

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

      setMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMsg.id
            ? {
                ...message,
                content: nextBotMessage.content,
                sources: nextBotMessage.sources,
                proposal: nextBotMessage.proposal,
                assistantKind: nextBotMessage.assistantKind,
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

  const handleActionRequest = useCallback(
    async (proposal: ChatActionProposal) => {
      if (isBusy) return
      setConfirmTarget(proposal)
      setConfirmPhrase('')
      setConfirmError('')
    },
    [isBusy],
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

  const handleConfirmExecute = useCallback(async () => {
    if (!confirmTarget) return

    if (confirmTarget.dangerLevel === 'high' && confirmPhrase.trim() !== DANGER_CONFIRM_PHRASE) {
      setConfirmError(`확인 문구를 정확히 입력해주세요. (${DANGER_CONFIRM_PHRASE})`)
      return
    }

    const confirmation: ChatExecuteConfirmation = {
      approved: true,
      phrase: confirmTarget.dangerLevel === 'high' ? confirmPhrase.trim() : undefined,
    }
    const proposal = confirmTarget

    setConfirmTarget(null)
    setConfirmPhrase('')
    setConfirmError('')

    await executeProposal(proposal, confirmation)
  }, [confirmPhrase, confirmTarget, executeProposal])

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className='fixed bottom-[100px] right-16 z-[998] flex h-52 w-52 items-center justify-center rounded-full bg-primary shadow-floating-primary active-press-duration active:scale-90 app:bottom-[116px]'>
          <OpenrunChatIcon size={28} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 z-[999] bg-black-darkest/60'
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className='fixed bottom-0 left-0 right-0 z-[1000] mx-auto flex h-[85dvh] max-w-tablet flex-col rounded-t-2xl bg-gray-lighten'
              onClick={(event) => event.stopPropagation()}>
              <div className='relative flex items-center border-b border-gray/30 px-20 py-16'>
                <div className='flex items-center gap-8'>
                  <div className='flex h-32 w-32 items-center justify-center rounded-full bg-primary'>
                    <OpenrunChatIcon size={20} />
                  </div>
                  <div>
                    <p className='text-14 font-bold text-black-darken'>오픈런 도우미</p>
                    <p className='text-10 text-gray-darken'>
                      {CHAT_AGENT_ENABLED ? '질문/실행 요청을 도와드려요' : '무엇이든 물어보세요'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className='absolute right-16 top-16 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'>
                  <BrokenXIcon size={24} color={colors.black.DEFAULT} />
                </button>
              </div>

              <div className='flex-1 overflow-y-auto px-16 py-12 scrollbar-hide'>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    disabled={isBusy}
                    onActionRequest={handleActionRequest}
                    onSelectRequiredInput={handleRequiredInputSelect}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className='border-t border-gray/30 px-16 pt-12 pb-[max(24px,env(safe-area-inset-bottom,24px))] app:pb-[max(36px,env(safe-area-inset-bottom,36px))]'>
                <div className='flex items-center gap-8'>
                  <input
                    ref={inputRef}
                    type='text'
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={CHAT_AGENT_ENABLED ? '질문 또는 실행 요청을 입력하세요...' : '질문을 입력하세요...'}
                    disabled={isBusy}
                    className='h-44 flex-1 rounded-22 border border-gray bg-white px-16 text-14 text-black-darken outline-none placeholder:text-gray-darken focus:border-primary disabled:opacity-50'
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isBusy}
                    className='flex h-44 w-44 flex-shrink-0 items-center justify-center rounded-full bg-primary active-press-duration active:scale-90 active:bg-primary-darken disabled:bg-gray disabled:text-gray-lighten'>
                    <SendIcon />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 z-[1200] bg-black-darkest/60'
              onClick={() => {
                if (isExecuting) return
                setConfirmTarget(null)
                setConfirmPhrase('')
                setConfirmError('')
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 16, x: '-50%' }}
              transition={{ duration: 0.2 }}
              className='fixed left-1/2 top-1/2 z-[1201] w-[calc(100%-32px)] max-w-[360px] rounded-16 bg-white p-16'>
              <h4 className='mb-8 text-18 font-bold text-black-darken'>요청 실행 확인</h4>
              <p className='mb-12 whitespace-pre-wrap text-14 text-black-darken'>{confirmTarget.summary}</p>

              {confirmTarget.dangerLevel === 'high' && (
                <div className='mb-10 rounded-8 border border-pink/30 bg-pink/10 p-10'>
                  <p className='mb-6 text-12 font-bold text-pink'>
                    위험 작업입니다. 확인 문구를 입력해야 실행됩니다.
                  </p>
                  <input
                    value={confirmPhrase}
                    onChange={(event) => {
                      setConfirmPhrase(event.target.value)
                      if (confirmError) setConfirmError('')
                    }}
                    placeholder={DANGER_CONFIRM_PHRASE}
                    className='h-40 w-full rounded-8 border border-pink/40 bg-white px-10 text-14 text-black-darken outline-none focus:border-pink'
                    disabled={isExecuting}
                  />
                  {confirmError && <p className='mt-6 text-12 font-bold text-pink'>{confirmError}</p>}
                </div>
              )}

              <div className='mt-12 flex gap-8'>
                <button
                  className='h-44 flex-1 rounded-8 bg-gray-lighten text-14 font-bold text-black-darken active-press-duration active:scale-98'
                  onClick={() => {
                    if (isExecuting) return
                    setConfirmTarget(null)
                    setConfirmPhrase('')
                    setConfirmError('')
                  }}
                  disabled={isExecuting}>
                  취소
                </button>
                <button
                  className='h-44 flex-1 rounded-8 bg-black-darken text-14 font-bold text-white active-press-duration active:scale-98 disabled:bg-gray-darken'
                  onClick={handleConfirmExecute}
                  disabled={isExecuting}>
                  실행
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function normalizeChatResponse(data: unknown): {
  content: string
  sources?: { source: string; content: string }[]
  proposal?: ChatActionProposal
  assistantKind?: ChatAssistantKind
} {
  if (isAssistantResponse(data)) {
    return {
      content: data.reply,
      sources: data.sources,
      proposal: data.proposal,
      assistantKind: data.kind,
    }
  }

  if (isLegacyResponse(data)) {
    return {
      content: data.answer,
      sources: data.sources,
      assistantKind: 'qa',
    }
  }

  return {
    content: '응답 형식을 해석하지 못했습니다. 다시 시도해주세요.',
    assistantKind: 'qa',
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
  onActionRequest,
  onSelectRequiredInput,
}: {
  message: Message
  disabled: boolean
  onActionRequest: (proposal: ChatActionProposal) => void
  onSelectRequiredInput: (message: Message, option: { id: string; label: string }) => void
}) {
  const isBot = message.role === 'bot'
  const canRequestAction =
    isBot &&
    message.proposal != null &&
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
          isBot ? 'rounded-tl-4 bg-white text-black-darken' : 'rounded-tr-4 bg-primary text-white',
        )}>
        {message.isLoading ? (
          <LoadingDots />
        ) : (
          <>
            <p className='whitespace-pre-wrap text-14 leading-[1.6]'>{message.content}</p>

            {message.sources && message.sources.length > 0 && (
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

            {canRequestAction && message.proposal && (
              <button
                className='mt-10 w-full rounded-8 bg-black-darken px-12 py-8 text-12 font-bold text-white active-press-duration active:scale-98 disabled:bg-gray-darken'
                onClick={() => onActionRequest(message.proposal as ChatActionProposal)}
                disabled={disabled}>
                부탁하기
              </button>
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

function SendIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
      <path d='M3 20L22 12L3 4V10L17 12L3 14V20Z' fill='currentColor' />
    </svg>
  )
}
