import { NextRequest, NextResponse } from 'next/server'

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
    const { question } = body

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: '질문을 입력해주세요' }, { status: 400 })
    }

    const botServerUrl = process.env.BOT_SERVER_URL
    if (!botServerUrl) {
      return NextResponse.json({ error: '봇 서버가 설정되지 않았습니다' }, { status: 500 })
    }

    const response = await fetch(`${botServerUrl}/rag/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || '봇 서버 응답 오류' },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '챗봇 응답 실패' }, { status: 500 })
  }
}
