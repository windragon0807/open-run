import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import {
  ChatActionNavigation,
  ChatActionProposal,
  ChatExecuteRequiredInput,
  ChatExecuteResponse,
} from '@type/chat-agent'
import { COOKIE } from '@constants/cookie'

const DANGER_CONFIRM_PHRASE = '실행합니다'
const DANGER_ACTIONS = new Set(['bung.delete', 'bung.delegate_owner', 'bung.kick_member', 'user.delete_account'])

type BackendResult = {
  ok: boolean
  status: number
  data: unknown
}

type Option = {
  id: string
  label: string
}

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().toLowerCase()
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => asString(item)).filter(Boolean) as string[]
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value)
  return undefined
}

function createNeedsInputResponse(
  message: string,
  key: string,
  options: Option[],
  proposal: ChatActionProposal,
): ChatExecuteResponse {
  const requiredInput: ChatExecuteRequiredInput = { key, options }
  return {
    status: 'needs_input',
    message,
    requiredInput,
    proposal,
  }
}

function updateProposalParam(proposal: ChatActionProposal, key: string, value: unknown): ChatActionProposal {
  return {
    ...proposal,
    params: { ...proposal.params, [key]: value },
    missingFields: proposal.missingFields.filter((field) => field !== key),
  }
}

function baseApiUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_API_SERVER_URL
  if (!url) return null
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function parseBackendErrorMessage(data: unknown): string {
  if (typeof data === 'string') return data
  if (data && typeof data === 'object') {
    const withMessage = data as { message?: unknown; detail?: unknown; error?: unknown }
    if (typeof withMessage.message === 'string') return withMessage.message
    if (typeof withMessage.detail === 'string') return withMessage.detail
    if (typeof withMessage.error === 'string') return withMessage.error
  }
  return '요청 처리 중 오류가 발생했습니다.'
}

async function callBackend(path: string, method: string, body?: unknown): Promise<BackendResult> {
  const apiBase = baseApiUrl()
  if (!apiBase) {
    return { ok: false, status: 500, data: { message: 'API 서버가 설정되지 않았습니다.' } }
  }

  const cookieStore = await cookies()
  const rawAccessToken = cookieStore.get(COOKIE.ACCESSTOKEN)?.value
  if (!rawAccessToken) {
    return { ok: false, status: 401, data: { message: '로그인이 필요합니다.' } }
  }
  const decoded = decodeURIComponent(rawAccessToken)
  const accessToken = decoded.startsWith('Bearer ') ? decoded : `Bearer ${decoded}`

  const headers: Record<string, string> = {
    Authorization: accessToken,
  }
  if (body != null) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))
  return { ok: response.ok, status: response.status, data }
}

async function getCurrentUserId(): Promise<string | null> {
  const res = await callBackend('/v1/users', 'GET')
  if (!res.ok) return null
  const data = res.data as { data?: { userId?: string } }
  return data.data?.userId ?? null
}

async function getMyBungOptions(): Promise<Option[]> {
  const res = await callBackend('/v1/bungs/my-bungs?status=ALL&page=0&limit=20', 'GET')
  if (!res.ok) return []
  const data = res.data as { data?: Array<{ bungId: string; name: string; startDateTime: string }> }
  return (data.data ?? []).map((bung) => ({
    id: bung.bungId,
    label: `${bung.name}`,
  }))
}

async function getDiscoverBungOptions(): Promise<Option[]> {
  const res = await callBackend('/v1/bungs?page=0&limit=20', 'GET')
  if (!res.ok) return []
  const data = res.data as { data?: Array<{ bungId: string; name: string }> }
  return (data.data ?? []).map((bung) => ({
    id: bung.bungId,
    label: bung.name,
  }))
}

async function getBungDetail(
  bungId: string,
): Promise<{ bungId: string; name: string; memberList: Array<{ userId: string; nickname: string; owner: boolean }> } | null> {
  const res = await callBackend(`/v1/bungs/${bungId}`, 'GET')
  if (!res.ok) return null
  const data = res.data as {
    data?: {
      bungId: string
      name: string
      memberList: Array<{ userId: string; nickname: string; owner: boolean }>
    }
  }
  return data.data ?? null
}

async function getMintableChallengeOptions(): Promise<Option[]> {
  const res = await callBackend('/v1/challenges/general?page=0&limit=30', 'GET')
  if (!res.ok) return []
  const data = res.data as {
    data?: Array<{ challengeId: number; challengeName: string; accomplished: boolean; nftCompleted: boolean }>
  }
  return (data.data ?? [])
    .filter((challenge) => challenge.accomplished && !challenge.nftCompleted)
    .map((challenge) => ({
      id: String(challenge.challengeId),
      label: challenge.challengeName,
    }))
}

function pickOptionByName(options: Option[], keyword?: string): Option | null {
  if (!keyword) return null
  const normalizedKeyword = normalizeText(keyword)
  const matched = options.filter((option) => normalizeText(option.label).includes(normalizedKeyword))
  return matched.length === 1 ? matched[0] : null
}

function navigationOrDefault(proposal: ChatActionProposal): ChatActionNavigation | undefined {
  if (proposal.navigation) return proposal.navigation
  if (proposal.actionKey === 'bung.create') {
    return {
      type: 'modal',
      modalKey: 'create-bung',
      prefill: {
        initialStep: 'create',
        draft: proposal.params,
      },
    }
  }
  if (proposal.actionKey === 'bung.invite_members') {
    return {
      type: 'modal',
      modalKey: 'create-bung',
      prefill: { initialStep: 'invitation' },
    }
  }
  if (proposal.actionKey === 'home.open_page') {
    return {
      type: 'route',
      href: '/',
    }
  }
  if (proposal.actionKey === 'challenge.open_page') {
    return {
      type: 'route',
      href: '/challenges?list=progress&category=general',
    }
  }
  if (proposal.actionKey === 'challenge.progress.open_page') {
    return {
      type: 'route',
      href: '/challenges?list=progress&category=general',
    }
  }
  if (proposal.actionKey === 'challenge.general.open_page') {
    return {
      type: 'route',
      href: '/challenges?list=progress&category=general',
    }
  }
  if (proposal.actionKey === 'challenge.repetitive.open_page') {
    return {
      type: 'route',
      href: '/challenges?list=progress&category=repetitive',
    }
  }
  if (proposal.actionKey === 'challenge.completed.open_page') {
    return {
      type: 'route',
      href: '/challenges?list=completed',
    }
  }
  if (proposal.actionKey === 'avatar.open_page') {
    return {
      type: 'route',
      href: '/avatar',
    }
  }
  if (proposal.actionKey === 'profile.open_page') {
    return {
      type: 'route',
      href: '/profile',
    }
  }
  if (proposal.actionKey === 'profile.modify.open_page') {
    return {
      type: 'route',
      href: '/profile/modify-user',
    }
  }
  if (proposal.actionKey === 'profile.notification.open_page') {
    return {
      type: 'route',
      href: '/profile/set-notification',
    }
  }
  if (proposal.actionKey === 'explore.open_page') {
    return {
      type: 'route',
      href: '/explore',
    }
  }
  if (proposal.actionKey === 'bung.search.open_page') {
    return {
      type: 'route',
      href: '/explore',
    }
  }
  if (proposal.actionKey === 'bung.detail.open_page') {
    const bungId = asString(proposal.params.bungId)
    return {
      type: 'route',
      href: bungId ? `/bung/${bungId}` : '/explore',
    }
  }
  if (proposal.actionKey === 'bung.manage_members.open_page') {
    const bungId = asString(proposal.params.bungId)
    return {
      type: 'route',
      href: bungId ? `/bung/${bungId}` : '/profile',
    }
  }
  if (proposal.actionKey === 'bung.delegate_owner.open_page') {
    const bungId = asString(proposal.params.bungId)
    return {
      type: 'route',
      href: bungId ? `/bung/${bungId}` : '/profile',
    }
  }
  if (proposal.actionKey === 'auth.signin.open_page') {
    return {
      type: 'route',
      href: '/signin',
    }
  }
  if (proposal.actionKey === 'auth.register.open_page') {
    return {
      type: 'route',
      href: '/register',
    }
  }
  return undefined
}

async function resolveBungId(
  proposal: ChatActionProposal,
  mode: 'my' | 'discover',
): Promise<{ bungId?: string; response?: ChatExecuteResponse; proposal: ChatActionProposal }> {
  const existingBungId = asString(proposal.params.bungId)
  if (existingBungId) return { bungId: existingBungId, proposal }

  const options = mode === 'my' ? await getMyBungOptions() : await getDiscoverBungOptions()
  if (options.length === 0) {
    return {
      proposal,
      response: {
        status: 'failed',
        message: '선택 가능한 벙을 찾지 못했습니다. 잠시 후 다시 시도해주세요.',
      },
    }
  }

  const hintedName = asString(proposal.params.bungName) ?? asString(proposal.params.bungTitle)
  const matched = pickOptionByName(options, hintedName)
  if (matched) {
    const nextProposal = updateProposalParam(proposal, 'bungId', matched.id)
    return { bungId: matched.id, proposal: nextProposal }
  }

  return {
    proposal,
    response: createNeedsInputResponse('대상 벙을 선택해 주세요.', 'bungId', options, proposal),
  }
}

async function resolveTargetMemberId(
  proposal: ChatActionProposal,
  bungId: string,
  mode: 'delegate' | 'kick' | 'feedback',
): Promise<{ targetUserId?: string; targetUserIds?: string[]; response?: ChatExecuteResponse; proposal: ChatActionProposal }> {
  if (mode !== 'feedback') {
    const existingTarget = asString(proposal.params.targetUserId)
    if (existingTarget) return { targetUserId: existingTarget, proposal }
  }

  const detail = await getBungDetail(bungId)
  if (!detail) {
    return {
      proposal,
      response: {
        status: 'failed',
        message: '대상 벙의 멤버 정보를 가져오지 못했습니다.',
      },
    }
  }

  const currentUserId = await getCurrentUserId()
  const members = detail.memberList.filter((member) => {
    if (mode === 'delegate' || mode === 'kick') return !member.owner
    if (mode === 'feedback') return member.userId !== currentUserId
    return true
  })

  if (mode === 'feedback') {
    const existingTargetIds = asStringArray(proposal.params.targetUserIds)
    if (existingTargetIds.length > 0) return { targetUserIds: existingTargetIds, proposal }
  }

  const hintedNickname = asString(proposal.params.targetNickname)
  const options = members.map((member) => ({
    id: member.userId,
    label: member.nickname,
  }))

  const matched = pickOptionByName(options, hintedNickname)
  if (matched) {
    if (mode === 'feedback') {
      const nextProposal = updateProposalParam(proposal, 'targetUserIds', [matched.id])
      return { targetUserIds: [matched.id], proposal: nextProposal }
    }
    const nextProposal = updateProposalParam(proposal, 'targetUserId', matched.id)
    return { targetUserId: matched.id, proposal: nextProposal }
  }

  if (mode === 'feedback') {
    return {
      proposal,
      response: createNeedsInputResponse('좋아요를 남길 멤버를 선택해 주세요.', 'targetUserIds', options, proposal),
    }
  }

  return {
    proposal,
    response: createNeedsInputResponse('대상 멤버를 선택해 주세요.', 'targetUserId', options, proposal),
  }
}

async function resolveChallengeId(
  proposal: ChatActionProposal,
): Promise<{ challengeId?: number; response?: ChatExecuteResponse; proposal: ChatActionProposal }> {
  const existingChallengeId = asNumber(proposal.params.challengeId)
  if (existingChallengeId != null) return { challengeId: existingChallengeId, proposal }

  const options = await getMintableChallengeOptions()
  if (options.length === 0) {
    return {
      proposal,
      response: {
        status: 'failed',
        message: '보상 수령 가능한 도전과제를 찾지 못했습니다.',
      },
    }
  }

  const hintedName = asString(proposal.params.challengeName)
  const matched = pickOptionByName(options, hintedName)
  if (matched) {
    const nextProposal = updateProposalParam(proposal, 'challengeId', Number(matched.id))
    return { challengeId: Number(matched.id), proposal: nextProposal }
  }

  return {
    proposal,
    response: createNeedsInputResponse('보상을 받을 도전과제를 선택해 주세요.', 'challengeId', options, proposal),
  }
}

async function failFromBackend(actionKey: string, backend: BackendResult): Promise<ChatExecuteResponse> {
  const message = parseBackendErrorMessage(backend.data)

  if (backend.status === 401) return { status: 'failed', message: '로그인이 만료되었습니다. 다시 로그인해주세요.' }
  if (backend.status === 403) return { status: 'failed', message: `권한이 없어 실행할 수 없습니다. (${message})` }
  if (backend.status === 409) return { status: 'failed', message: `현재 상태에서 실행할 수 없습니다. (${message})` }
  if (backend.status === 404) return { status: 'failed', message: `대상을 찾지 못했습니다. (${message})` }
  return { status: 'failed', message: `${actionKey} 실행에 실패했습니다. (${message})` }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const proposal = body.proposal as ChatActionProposal | undefined
    const confirmation = body.confirmation as { approved?: boolean; phrase?: string } | undefined

    if (!proposal || typeof proposal.actionKey !== 'string') {
      return NextResponse.json({ status: 'failed', message: '실행 제안 정보가 올바르지 않습니다.' }, { status: 400 })
    }
    if (!confirmation?.approved) {
      return NextResponse.json({ status: 'failed', message: '실행이 취소되었습니다.' }, { status: 200 })
    }
    if (DANGER_ACTIONS.has(proposal.actionKey) && (confirmation.phrase ?? '').trim() !== DANGER_CONFIRM_PHRASE) {
      return NextResponse.json(
        { status: 'failed', message: `강화 확인 문구가 일치하지 않습니다. (${DANGER_CONFIRM_PHRASE})` },
        { status: 200 },
      )
    }

    let workingProposal = proposal

    if (proposal.actionKey === 'bung.create') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '벙 생성 화면으로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'bung.invite_members') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '초대 자동 실행은 아직 미지원입니다. 초대 화면으로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'bung.modify') {
      const resolved = await resolveBungId(workingProposal, 'my')
      workingProposal = resolved.proposal
      if (resolved.response) return NextResponse.json(resolved.response, { status: 200 })
      return NextResponse.json(
        {
          status: 'navigated',
          message: '벙 수정 화면으로 이동합니다.',
          navigation: {
            type: 'route',
            href: `/bung/${resolved.bungId}?chatAction=modify`,
          },
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (
      proposal.actionKey === 'challenge.open_page' ||
      proposal.actionKey === 'challenge.progress.open_page' ||
      proposal.actionKey === 'challenge.general.open_page' ||
      proposal.actionKey === 'challenge.repetitive.open_page' ||
      proposal.actionKey === 'challenge.completed.open_page'
    ) {
      const messageByAction: Record<string, string> = {
        'challenge.open_page': '도전과제 페이지로 이동합니다.',
        'challenge.progress.open_page': '진행 중 도전과제 페이지로 이동합니다.',
        'challenge.general.open_page': '일반 도전과제 페이지로 이동합니다.',
        'challenge.repetitive.open_page': '반복 도전과제 페이지로 이동합니다.',
        'challenge.completed.open_page': '완료 도전과제 페이지로 이동합니다.',
      }
      return NextResponse.json(
        {
          status: 'navigated',
          message: messageByAction[proposal.actionKey] ?? '도전과제 페이지로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'home.open_page') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '홈 화면으로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'avatar.open_page') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '아바타 페이지로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'profile.open_page') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '프로필 페이지로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'profile.modify.open_page') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '프로필 정보 수정 페이지로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'profile.notification.open_page') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '알림 설정 페이지로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'explore.open_page' || proposal.actionKey === 'bung.search.open_page') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: proposal.actionKey === 'bung.search.open_page' ? '벙 검색 페이지로 이동합니다.' : '벙 탐색 페이지로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'auth.signin.open_page') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '로그인 페이지로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'auth.register.open_page') {
      return NextResponse.json(
        {
          status: 'navigated',
          message: '회원가입 페이지로 이동합니다.',
          navigation: navigationOrDefault(proposal),
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'bung.detail.open_page') {
      const resolved = await resolveBungId(workingProposal, 'discover')
      workingProposal = resolved.proposal
      if (resolved.response) return NextResponse.json(resolved.response, { status: 200 })
      return NextResponse.json(
        {
          status: 'navigated',
          message: '벙 상세 페이지로 이동합니다.',
          navigation: {
            type: 'route',
            href: `/bung/${resolved.bungId}`,
          },
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'bung.manage_members.open_page') {
      const resolved = await resolveBungId(workingProposal, 'my')
      workingProposal = resolved.proposal
      if (resolved.response) return NextResponse.json(resolved.response, { status: 200 })

      const detail = await getBungDetail(String(resolved.bungId))
      if (!detail) {
        return NextResponse.json(
          {
            status: 'failed',
            message: '멤버 관리에 필요한 벙 정보를 가져오지 못했습니다.',
          } as ChatExecuteResponse,
          { status: 200 },
        )
      }

      const memberList = encodeURIComponent(JSON.stringify(detail.memberList ?? []))
      return NextResponse.json(
        {
          status: 'navigated',
          message: '멤버 관리 페이지로 이동합니다.',
          navigation: {
            type: 'route',
            href: `/bung/${resolved.bungId}/manage-members?memberList=${memberList}`,
          },
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'bung.delegate_owner.open_page') {
      const resolved = await resolveBungId(workingProposal, 'my')
      workingProposal = resolved.proposal
      if (resolved.response) return NextResponse.json(resolved.response, { status: 200 })

      const detail = await getBungDetail(String(resolved.bungId))
      if (!detail) {
        return NextResponse.json(
          {
            status: 'failed',
            message: '벙주 위임에 필요한 벙 정보를 가져오지 못했습니다.',
          } as ChatExecuteResponse,
          { status: 200 },
        )
      }

      const memberList = encodeURIComponent(JSON.stringify(detail.memberList ?? []))
      return NextResponse.json(
        {
          status: 'navigated',
          message: '벙주 위임 페이지로 이동합니다.',
          navigation: {
            type: 'route',
            href: `/bung/${resolved.bungId}/delegate-owner?memberList=${memberList}`,
          },
        } as ChatExecuteResponse,
        { status: 200 },
      )
    }

    if (proposal.actionKey === 'user.delete_account') {
      const backend = await callBackend('/v1/users', 'DELETE')
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '계정 탈퇴가 완료되었습니다.' } as ChatExecuteResponse)
    }

    if (proposal.actionKey === 'challenge.mint_nft') {
      const resolved = await resolveChallengeId(workingProposal)
      workingProposal = resolved.proposal
      if (resolved.response) return NextResponse.json(resolved.response, { status: 200 })

      const backend = await callBackend(`/v1/nft/mint?challengeId=${resolved.challengeId}`, 'POST')
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: 'NFT 보상 요청을 실행했습니다.' } as ChatExecuteResponse)
    }

    const resolveMode = proposal.actionKey === 'bung.join' ? 'discover' : 'my'
    const resolvedBung = await resolveBungId(workingProposal, resolveMode)
    workingProposal = resolvedBung.proposal
    if (resolvedBung.response) return NextResponse.json(resolvedBung.response, { status: 200 })
    const bungId = resolvedBung.bungId as string

    if (proposal.actionKey === 'bung.complete') {
      const backend = await callBackend(`/v1/bungs/${bungId}/complete`, 'PATCH')
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '벙 완료를 요청했습니다.' } as ChatExecuteResponse)
    }

    if (proposal.actionKey === 'bung.join') {
      const backend = await callBackend(`/v1/bungs/${bungId}/join`, 'GET')
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '벙 참여 요청을 보냈습니다.' } as ChatExecuteResponse)
    }

    if (proposal.actionKey === 'bung.leave') {
      const userId = asString(workingProposal.params.userId) ?? (await getCurrentUserId())
      if (!userId) {
        return NextResponse.json({ status: 'failed', message: '현재 사용자 정보를 확인하지 못했습니다.' } as ChatExecuteResponse)
      }
      const backend = await callBackend(`/v1/bungs/${bungId}/members/${userId}`, 'DELETE')
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '벙 참여 취소가 완료되었습니다.' } as ChatExecuteResponse)
    }

    if (proposal.actionKey === 'bung.delete') {
      const backend = await callBackend(`/v1/bungs/${bungId}`, 'DELETE')
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '벙 삭제가 완료되었습니다.' } as ChatExecuteResponse)
    }

    if (proposal.actionKey === 'bung.certify') {
      const backend = await callBackend(`/v1/bungs/${bungId}/participated`, 'PATCH')
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '참여 인증 요청을 실행했습니다.' } as ChatExecuteResponse)
    }

    if (proposal.actionKey === 'bung.delegate_owner') {
      const resolvedMember = await resolveTargetMemberId(workingProposal, bungId, 'delegate')
      workingProposal = resolvedMember.proposal
      if (resolvedMember.response) return NextResponse.json(resolvedMember.response, { status: 200 })

      const backend = await callBackend(
        `/v1/bungs/${bungId}/change-owner?newOwnerUserId=${resolvedMember.targetUserId}`,
        'PATCH',
      )
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '벙주 변경 요청을 실행했습니다.' } as ChatExecuteResponse)
    }

    if (proposal.actionKey === 'bung.kick_member') {
      const resolvedMember = await resolveTargetMemberId(workingProposal, bungId, 'kick')
      workingProposal = resolvedMember.proposal
      if (resolvedMember.response) return NextResponse.json(resolvedMember.response, { status: 200 })

      const backend = await callBackend(`/v1/bungs/${bungId}/members/${resolvedMember.targetUserId}`, 'DELETE')
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '멤버 내보내기를 실행했습니다.' } as ChatExecuteResponse)
    }

    if (proposal.actionKey === 'bung.send_feedback') {
      const resolvedMember = await resolveTargetMemberId(workingProposal, bungId, 'feedback')
      workingProposal = resolvedMember.proposal
      if (resolvedMember.response) return NextResponse.json(resolvedMember.response, { status: 200 })

      const targetUserIds = resolvedMember.targetUserIds ?? asStringArray(workingProposal.params.targetUserIds)
      if (targetUserIds.length === 0) {
        return NextResponse.json({
          status: 'failed',
          message: '좋아요를 남길 대상 멤버를 지정해 주세요.',
        } as ChatExecuteResponse)
      }

      const backend = await callBackend('/v1/users/feedback', 'PATCH', {
        bungId,
        targetUserIds,
      })
      if (!backend.ok) return NextResponse.json(await failFromBackend(proposal.actionKey, backend), { status: 200 })
      return NextResponse.json({ status: 'success', message: '좋아요 전송을 완료했습니다.' } as ChatExecuteResponse)
    }

    return NextResponse.json(
      {
        status: 'failed',
        message: `지원하지 않는 액션입니다: ${proposal.actionKey}`,
      } as ChatExecuteResponse,
      { status: 400 },
    )
  } catch (error) {
    return NextResponse.json({ status: 'failed', message: '실행 처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
