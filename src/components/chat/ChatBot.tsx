'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { BrokenXIcon } from '@components/icons/x'
import { colors } from '@styles/colors'

type Message = {
  id: string
  role: 'user' | 'bot'
  content: string
  sources?: { source: string; content: string }[]
  isLoading?: boolean
}

export default function ChatBot() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || isLoading) return

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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '응답을 받을 수 없습니다')
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsg.id
            ? { ...msg, content: data.answer, sources: data.sources, isLoading: false }
            : msg,
        ),
      )
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsg.id
            ? { ...msg, content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.', isLoading: false }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className='fixed bottom-[100px] right-16 z-[998] flex h-52 w-52 items-center justify-center rounded-full bg-primary shadow-floating-primary active-press-duration active:scale-90 app:bottom-[116px]'>
          <OpenrunChatIcon size={28} />
        </button>
      )}

      {/* 채팅 모달 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 딤드 배경 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 z-[999] bg-black-darkest/60'
              onClick={() => setIsOpen(false)}
            />

            {/* 채팅 패널 */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className='fixed bottom-0 left-0 right-0 z-[1000] mx-auto flex h-[85dvh] max-w-tablet flex-col rounded-t-2xl bg-gray-lighten'
              onClick={(e) => e.stopPropagation()}>
              {/* 헤더 */}
              <div className='relative flex items-center border-b border-gray/30 px-20 py-16'>
                <div className='flex items-center gap-8'>
                  <div className='flex h-32 w-32 items-center justify-center rounded-full bg-primary'>
                    <OpenrunChatIcon size={20} />
                  </div>
                  <div>
                    <p className='text-14 font-bold text-black-darken'>오픈런 도우미</p>
                    <p className='text-10 text-gray-darken'>무엇이든 물어보세요</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className='absolute right-16 top-16 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'>
                  <BrokenXIcon size={24} color={colors.black.DEFAULT} />
                </button>
              </div>

              {/* 메시지 목록 */}
              <div className='flex-1 overflow-y-auto px-16 py-12 scrollbar-hide'>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className='border-t border-gray/30 px-16 pt-12 pb-[max(24px,env(safe-area-inset-bottom,24px))] app:pb-[max(36px,env(safe-area-inset-bottom,36px))]'>
                <div className='flex items-center gap-8'>
                  <input
                    ref={inputRef}
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='질문을 입력하세요...'
                    disabled={isLoading}
                    className='h-44 flex-1 rounded-22 border border-gray bg-white px-16 text-14 text-black-darken outline-none placeholder:text-gray-darken focus:border-primary disabled:opacity-50'
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className='flex h-44 w-44 flex-shrink-0 items-center justify-center rounded-full bg-primary active-press-duration active:scale-90 active:bg-primary-darken disabled:bg-gray disabled:text-gray-lighten'>
                    <SendIcon />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isBot = message.role === 'bot'

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
                  {message.sources.map((s, i) => (
                    <span
                      key={i}
                      className='inline-block rounded-4 bg-gray-lighten px-6 py-2 text-10 text-gray-darker'>
                      {s.source.replace(/^\d+_/, '').replace(/\.md$/, '').replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
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
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className='h-6 w-6 rounded-full bg-gray-darken'
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

// === 아이콘 ===

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
    <svg width={20} height={20} viewBox='0 0 24 24' fill='none'>
      <path d='M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z' fill='white' />
    </svg>
  )
}
