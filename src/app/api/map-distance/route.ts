import { NextResponse, NextRequest } from 'next/server'

/**
 * lat: 위도, lng: 경도
 * {
 *   startLat: 37.519570,
 *   startLng: 127.027964,
 *   endLat: 37.516263,
 *   endLng: 127.019895
 * }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const startLat = searchParams.get('startLat')
  const startLng = searchParams.get('startLng')
  const endLat = searchParams.get('endLat')
  const endLng = searchParams.get('endLng')

  if (!startLat || !startLng || !endLat || !endLng) {
    return NextResponse.json({ error: '올바른 시작점과 도착점 좌표를 입력해주세요' }, { status: 400 })
  }

  try {
    // https://api.ncloud-docs.com/docs/ai-naver-mapsdirections-driving
    const response = await fetch(
      `${process.env.NAVER_MAP_DIRECTION5_SERVER_URL}/driving?start=${startLng}%2C${startLat}&goal=${endLng}%2C${endLat}`,
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
