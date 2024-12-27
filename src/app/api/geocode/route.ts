import { NextResponse, NextRequest } from 'next/server'

/**
 * GET /api/geocode
 * query params:
 * {
 *   address: string; (주소)
 * }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: '올바른 주소를 입력해주세요' }, { status: 400 })
  }

  try {
    // https://api.ncloud-docs.com/docs/ai-naver-mapsgeocoding-geocode
    const response = await fetch(`${NAVER_MAP_GEOCODING_API_URL}/geocode?query=${address}`, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_CLIENT_SECRET,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '경로 조회 실패' }, { status: 500 })
  }
}

const NAVER_MAP_GEOCODING_API_URL = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2'
