import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/weather
 * query params:
 * {
 *   lat: string; (위도)
 *   lng: string; (경도)
 * }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json({ error: '올바른 좌표를 입력해주세요' }, { status: 400 })
  }

  try {
    // https://openweathermap.org/api/one-call-3
    // units=metric : 섭씨 온도로 변환
    const response = await fetch(
      `${OPENWEATHER_API_URL}/onecall?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&exclude=hourly,daily,minutely,alerts&units=metric`,
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '경로 조회 실패' }, { status: 500 })
  }
}

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/3.0'
