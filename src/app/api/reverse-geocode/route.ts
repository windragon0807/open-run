import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/reverse-geocoding
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
    // https://api.ncloud-docs.com/docs/ai-naver-mapsreversegeocoding-gc
    const response = await fetch(
      `${NAVER_MAP_REVERSE_GEOCODING_API_URL}/gc?coords=${lng}%2C${lat}&output=json&orders=legalcode%2Cadmcode%2Caddr%2Croadaddr`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_CLIENT_SECRET,
        },
      },
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '경로 조회 실패' }, { status: 500 })
  }
}

const NAVER_MAP_REVERSE_GEOCODING_API_URL = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2'
