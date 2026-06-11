import { NextRequest, NextResponse } from 'next/server'
import http from '@apis/http.server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const response = await http.get('/v1/challenges/completed-with-nft', {
      params: Object.fromEntries(searchParams),
    })

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: '완료한 도전과제 정보를 불러오지 못했습니다' }, { status: 500 })
  }
}
