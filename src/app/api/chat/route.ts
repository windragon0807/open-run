import { NextRequest, NextResponse } from 'next/server'
import { ChatAssistantResponse, ChatHistoryItem } from '@type/chat-agent'

/**
 * POST /api/chat
 * body: { question: string }
 *
 * 봇 서버의 RAG 엔드포인트를 프록시합니다.
 * 환경변수 BOT_SERVER_URL에 봇 서버 주소를 설정해야 합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = typeof body.message === 'string' ? body.message : undefined
    const question = typeof body.question === 'string' ? body.question : undefined
    const history = Array.isArray(body.history) ? (body.history as ChatHistoryItem[]) : []
    const pendingAction =
      body.pendingAction != null && typeof body.pendingAction === 'object' ? body.pendingAction : null

    const finalMessage = (message ?? question ?? '').trim()
    if (!finalMessage) return NextResponse.json({ error: '질문을 입력해주세요' }, { status: 400 })

    const botServerUrl = process.env.BOT_SERVER_URL
    if (!botServerUrl) {
      return NextResponse.json({ error: '봇 서버가 설정되지 않았습니다' }, { status: 500 })
    }

    const useAssistant = message != null || history.length > 0 || pendingAction != null
    const targetPath = useAssistant ? '/rag/assistant' : '/rag/query'
    const targetPayload = useAssistant
      ? {
          message: finalMessage,
          history: history.slice(-20),
          pendingAction,
        }
      : { question: finalMessage }

    const response = await fetch(`${botServerUrl}${targetPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targetPayload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || '봇 서버 응답 오류' },
        { status: response.status },
      )
    }

    const data = (await response.json()) as ChatAssistantResponse | { answer: string; sources?: unknown[] }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '챗봇 응답 실패' }, { status: 500 })
  }
}
