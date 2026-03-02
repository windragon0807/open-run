import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import {
  BungRef,
  ChatActionProposal,
  ChatAssistantResponse,
  ChatHistoryItem,
  ConversationBungEntity,
  ConversationState,
  ConversationStatePatch,
} from '@type/chat-agent'
import { COOKIE } from '@constants/cookie'

type BungStatus = 'ALL' | 'PARTICIPATING' | 'ONGOING' | 'PENDING'
type ReadScope = 'all' | 'active'

type MyBungItem = {
  bungId: string
  name: string
  currentMemberCount?: number
}

type MyBungWithStatus = MyBungItem & {
  status: BungStatus
}

type ChallengeCategory = 'general' | 'repetitive' | 'completed'

type ChallengeItem = {
  challengeId: number
  challengeName: string
  currentCount?: number
  conditionCount?: number
  accomplished?: boolean
  nftCompleted?: boolean
}

type ChallengeWithCategory = ChallengeItem & {
  category: ChallengeCategory
}

type UserProfile = {
  userId: string
  nickname: string
  email: string
  blockchainAddress: string
  provider: string
  runningPace: string
  runningFrequency: number
}

type SuggestionUser = {
  userId: string
  nickname: string
  email: string
  runningPace: string
  runningFrequency: number
  collabCount: number
}

type ExploreBungItem = {
  bungId: string
  name: string
}

type BungDetailResponse = {
  data?: {
    bungId: string
    name: string
    memberList?: Array<{ userId: string; nickname: string; owner: boolean }>
    currentMemberCount?: number
  }
}

type PagedResponse<T> = {
  message?: string
  data?: T[]
  totalPages?: number
  totalElements?: number
  first?: boolean
  last?: boolean
  empty?: boolean
}

type ApiAuthContext = {
  apiBase: string
  accessToken: string
}

type BackendResult<T> = {
  ok: boolean
  status: number
  data: T
}

type BotLegacyResponse = {
  answer: string
  sources?: { source: string; content: string }[]
}

type ResolvedBung = {
  bungId: string
  name: string
  currentMemberCount?: number
  status?: string
  order?: number
}

type ResolveTargetResult =
  | { ok: true; target: ResolvedBung; statePatch: ConversationStatePatch }
  | { ok: false; response: ChatAssistantResponse }

type ChallengeSummary = {
  claimable: number
  completed: number
  generalInProgress: number
  repetitiveInProgress: number
}

type ChallengeResolution =
  | { status: 'missing_name' }
  | { status: 'not_found'; query: string }
  | { status: 'ambiguous'; query: string; candidates: ChallengeWithCategory[] }
  | { status: 'resolved'; query: string; target: ChallengeWithCategory }

const READ_ACTIONS = new Set([
  'read.my_bungs.count',
  'read.my_bungs.names',
  'read.my_bung.member_count',
  'read.my_bung.members',
  'read.weather.current',
  'read.challenge.claimable.count',
  'read.challenge.claimable.list',
  'read.challenge.completed.count',
  'read.challenge.completed.list',
  'read.challenge.progress.summary',
  'read.challenge.by_name.status',
  'read.user.profile.summary',
  'read.user.profile.nickname',
  'read.user.profile.email',
  'read.user.profile.wallet',
  'read.user.running.preferences',
  'read.user.suggestions.count',
  'read.user.suggestions.list',
  'read.bungs.explore.count',
  'read.bungs.explore.names',
])

const READ_UI_HINTS = {
  showSources: false,
  showActionButtons: false,
} as const

const QA_UI_HINTS = {
  showSources: true,
  showActionButtons: false,
} as const

const CHAT_UI_HINTS = {
  showSources: false,
  showActionButtons: false,
} as const

function isAssistantResponse(value: unknown): value is ChatAssistantResponse {
  if (!value || typeof value !== 'object') return false
  const raw = value as { kind?: unknown; reply?: unknown }
  return typeof raw.kind === 'string' && typeof raw.reply === 'string'
}

function isLegacyResponse(value: unknown): value is BotLegacyResponse {
  if (!value || typeof value !== 'object') return false
  const raw = value as { answer?: unknown }
  return typeof raw.answer === 'string'
}

function mapStatusToReadError(status: number): string {
  switch (status) {
    case 401:
      return '로그인이 필요해요. 로그인 후 다시 물어봐 주세요.'
    case 403:
      return '본인 계정 정보만 조회할 수 있어요.'
    case 409:
      return '요청 상태가 변경되어 조회할 수 없어요. 잠시 후 다시 시도해 주세요.'
    case 500:
    case 502:
    case 503:
      return '지금은 서버 상태 때문에 확인이 어려워요. 잠시 후 다시 시도해 주세요.'
    default:
      return '지금은 요청하신 정보를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.'
  }
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function normalizeTight(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '')
}

function looksLikeOtherPersonRequest(message: string): boolean {
  const normalized = normalizeText(message)
  if (/(다른 사람|타인|남의|상대방|친구|누구|누가|회원|유저|사용자)/.test(normalized)) return true
  if (/[가-힣a-z0-9_]{2,}\s*님/.test(message)) return true
  if (/[가-힣a-z0-9_]{2,}\s*의\s*벙/.test(message) && !/(내|나|저|제)\s*의?\s*벙/.test(message)) return true
  return false
}

function parseScope(proposal: ChatActionProposal, message: string): ReadScope {
  const scope = proposal.params?.scope
  if (scope === 'active' || scope === 'all') return scope

  const normalized = normalizeText(message)
  if (/(지금|현재|참여 중|참여하고 있는|참가 중|진행 중)/.test(normalized)) return 'active'
  return 'all'
}

function mergeStatePatch(
  base: ConversationStatePatch | undefined,
  patch: ConversationStatePatch | undefined,
): ConversationStatePatch | undefined {
  if (!base && !patch) return undefined
  if (!base) return patch
  if (!patch) return base

  return {
    entities: {
      ...base.entities,
      ...patch.entities,
      bungs: patch.entities?.bungs ?? base.entities?.bungs,
    },
    focus: {
      ...base.focus,
      ...patch.focus,
    },
    lastReadResult: {
      ...base.lastReadResult,
      ...patch.lastReadResult,
    },
    pendingClarification: {
      ...base.pendingClarification,
      ...patch.pendingClarification,
    },
  }
}

function stateBungs(conversationState: ConversationState | null | undefined): ConversationBungEntity[] {
  const bungs = conversationState?.entities?.bungs
  if (!Array.isArray(bungs)) return []
  return [...bungs].sort((a, b) => (a.order ?? 99999) - (b.order ?? 99999))
}

function toConversationEntities(items: MyBungWithStatus[]): ConversationBungEntity[] {
  return items.map((item, index) => ({
    bungId: item.bungId,
    name: item.name,
    currentMemberCount: item.currentMemberCount,
    status: item.status,
    order: index + 1,
  }))
}

function parseBungRefFromUnknown(value: unknown): BungRef | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as { type?: unknown; value?: unknown }
  if (!['id', 'name', 'index', 'deictic'].includes(String(raw.type))) return undefined
  const refType = raw.type as BungRef['type']
  if (refType === 'index') {
    const n = typeof raw.value === 'number' ? raw.value : Number(raw.value)
    if (!Number.isFinite(n) || n < 1) return undefined
    return { type: 'index', value: Math.floor(n) }
  }
  if (typeof raw.value !== 'string' || raw.value.trim() === '') return undefined
  return { type: refType, value: raw.value.trim() }
}

function parseBungRefFromMessage(message: string, conversationState: ConversationState | null | undefined): BungRef | undefined {
  const indexMatch = message.match(/(\d+)\s*번/)
  if (indexMatch) {
    return { type: 'index', value: Number(indexMatch[1]) }
  }

  const normalized = normalizeTight(message)
  const ordinalMap: Record<string, number> = {
    첫번째: 1,
    첫째: 1,
    두번째: 2,
    둘째: 2,
    세번째: 3,
    셋째: 3,
    네번째: 4,
    넷째: 4,
    다섯번째: 5,
  }
  for (const [token, value] of Object.entries(ordinalMap)) {
    if (normalized.includes(token)) return { type: 'index', value }
  }

  if (['그벙', '방금벙', '방금말한벙', '이벙', '해당벙', '저벙'].some((token) => normalized.includes(token))) {
    return { type: 'deictic', value: 'last' }
  }

  const bungs = stateBungs(conversationState)
  let matched: ConversationBungEntity | null = null
  let matchedLen = 0

  for (const bung of bungs) {
    const name = bung.name?.trim()
    if (!name) continue
    const tightName = normalizeTight(name)
    if (!tightName) continue
    if (normalized.includes(tightName) && tightName.length > matchedLen) {
      matched = bung
      matchedLen = tightName.length
    }
  }

  if (matched?.name) {
    return { type: 'name', value: matched.name }
  }

  return undefined
}

function resolveFromState(ref: BungRef, conversationState: ConversationState | null | undefined): ResolvedBung[] {
  const bungs = stateBungs(conversationState)
  if (bungs.length === 0) return []

  if (ref.type === 'id') {
    return bungs.filter((item) => item.bungId === ref.value).map((item) => ({ ...item }))
  }

  if (ref.type === 'index') {
    const index = Number(ref.value)
    if (!Number.isFinite(index) || index < 1) return []
    const byOrder = bungs.find((item) => item.order === index)
    if (byOrder) return [{ ...byOrder }]
    const byIndex = bungs[index - 1]
    return byIndex ? [{ ...byIndex }] : []
  }

  if (ref.type === 'deictic') {
    const focus = conversationState?.focus?.lastBungId
    if (focus) {
      const matched = bungs.find((item) => item.bungId === focus)
      if (matched) return [{ ...matched }]
    }
    return bungs.length > 0 ? [{ ...bungs[0] }] : []
  }

  const target = normalizeTight(String(ref.value))
  if (!target) return []

  const exact = bungs.filter((item) => normalizeTight(item.name ?? '') === target)
  if (exact.length > 0) return exact.map((item) => ({ ...item }))

  const partial = bungs.filter((item) => normalizeTight(item.name ?? '').includes(target))
  return partial.map((item) => ({ ...item }))
}

function formatAmbiguousBungReply(candidates: ResolvedBung[]): string {
  const listed = candidates.slice(0, 8).map((bung, index) => `${index + 1}. ${bung.name}`).join('\n')
  return `여러 벙이 후보로 보여요. 정확한 대상을 선택해 주세요.\n${listed}`
}

function mapWeatherConditionToKorean(id: number): string {
  if (id >= 200 && id < 300) return '천둥번개를 동반한 비'
  if (id >= 300 && id < 400) return '이슬비'
  if (id >= 500 && id < 600) return '비'
  if (id >= 600 && id < 700) return '눈'
  if (id === 800) return '맑음'
  if (id > 800 && id < 900) return '구름 많음'
  return '맑음'
}

async function geocodeLocation(address: string): Promise<{ ok: true; lat: number; lng: number } | { ok: false; message: string }> {
  const googleApiKey = process.env.GOOGLE_API_KEY
  if (!googleApiKey) {
    return { ok: false, message: '날씨 조회 설정이 아직 완료되지 않았어요. 관리자에게 문의해 주세요.' }
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.append('key', googleApiKey)
  url.searchParams.append('address', address)
  url.searchParams.append('language', 'ko')

  const response = await fetch(url.toString())
  if (!response.ok) {
    return { ok: false, message: '지역 좌표를 확인하지 못했어요. 지역명을 다시 입력해 주세요.' }
  }

  const data = (await response.json().catch(() => ({}))) as {
    status?: string
    results?: Array<{
      geometry?: {
        location?: {
          lat?: number
          lng?: number
        }
      }
    }>
  }

  const location = data.results?.[0]?.geometry?.location
  if (data.status !== 'OK' || typeof location?.lat !== 'number' || typeof location?.lng !== 'number') {
    return { ok: false, message: '해당 지역을 찾지 못했어요. 시/구 단위로 다시 알려주세요.' }
  }

  return { ok: true, lat: location.lat, lng: location.lng }
}

async function fetchCurrentWeatherByLocation(
  locationText: string,
): Promise<{ ok: true; temperature: number; condition: string } | { ok: false; message: string }> {
  const geocode = await geocodeLocation(locationText)
  if (!geocode.ok) return geocode

  const openWeatherKey = process.env.OPENWEATHER_API_KEY
  if (!openWeatherKey) {
    return { ok: false, message: '날씨 조회 설정이 아직 완료되지 않았어요. 관리자에게 문의해 주세요.' }
  }

  const url = new URL('https://api.openweathermap.org/data/3.0/onecall')
  url.searchParams.append('lat', String(geocode.lat))
  url.searchParams.append('lon', String(geocode.lng))
  url.searchParams.append('appid', openWeatherKey)
  url.searchParams.append('exclude', 'hourly,daily,minutely,alerts')
  url.searchParams.append('units', 'metric')

  const response = await fetch(url.toString())
  if (!response.ok) {
    return { ok: false, message: '날씨 정보를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.' }
  }

  const data = (await response.json().catch(() => ({}))) as {
    current?: {
      temp?: number
      weather?: Array<{ id?: number }>
    }
  }

  const temperature = data.current?.temp
  const weatherId = data.current?.weather?.[0]?.id
  if (typeof temperature !== 'number' || typeof weatherId !== 'number') {
    return { ok: false, message: '날씨 데이터 형식이 올바르지 않아 다시 시도해 주세요.' }
  }

  return {
    ok: true,
    temperature,
    condition: mapWeatherConditionToKorean(weatherId),
  }
}

async function getApiAuthContext(): Promise<{ ok: true; value: ApiAuthContext } | { ok: false; message: string }> {
  const apiBase = process.env.NEXT_PUBLIC_API_SERVER_URL
  if (!apiBase) {
    return { ok: false, message: 'API 서버 설정이 없어 정보를 조회할 수 없어요.' }
  }

  const cookieStore = await cookies()
  const rawAccessToken = cookieStore.get(COOKIE.ACCESSTOKEN)?.value
  if (!rawAccessToken) {
    return { ok: false, message: '로그인이 필요해요. 로그인 후 다시 물어봐 주세요.' }
  }
  const decoded = decodeURIComponent(rawAccessToken)
  const accessToken = decoded.startsWith('Bearer ') ? decoded : `Bearer ${decoded}`

  return {
    ok: true,
    value: {
      apiBase: apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase,
      accessToken,
    },
  }
}

async function callMyBungs(
  context: ApiAuthContext,
  status: BungStatus,
  page: number,
  limit: number,
): Promise<BackendResult<PagedResponse<MyBungItem>>> {
  const response = await fetch(`${context.apiBase}/v1/bungs/my-bungs?status=${status}&page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      Authorization: context.accessToken,
    },
  })

  const data = (await response.json().catch(() => ({}))) as PagedResponse<MyBungItem>
  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

async function callBungDetail(context: ApiAuthContext, bungId: string): Promise<BackendResult<BungDetailResponse>> {
  const response = await fetch(`${context.apiBase}/v1/bungs/${bungId}`, {
    method: 'GET',
    headers: {
      Authorization: context.accessToken,
    },
  })

  const data = (await response.json().catch(() => ({}))) as BungDetailResponse
  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

async function callChallengeList(
  context: ApiAuthContext,
  category: ChallengeCategory,
  page: number,
  limit: number,
): Promise<BackendResult<PagedResponse<ChallengeItem>>> {
  const response = await fetch(`${context.apiBase}/v1/challenges/${category}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      Authorization: context.accessToken,
    },
  })

  const data = (await response.json().catch(() => ({}))) as PagedResponse<ChallengeItem>
  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

async function callUserInfo(context: ApiAuthContext): Promise<BackendResult<{ data?: UserProfile }>> {
  const response = await fetch(`${context.apiBase}/v1/users`, {
    method: 'GET',
    headers: {
      Authorization: context.accessToken,
    },
  })

  const data = (await response.json().catch(() => ({}))) as { data?: UserProfile }
  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

async function callSuggestionUsers(
  context: ApiAuthContext,
  page: number,
  limit: number,
): Promise<BackendResult<PagedResponse<SuggestionUser>>> {
  const response = await fetch(`${context.apiBase}/v1/users/suggestion?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      Authorization: context.accessToken,
    },
  })

  const data = (await response.json().catch(() => ({}))) as PagedResponse<SuggestionUser>
  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

async function callExploreBungs(
  context: ApiAuthContext,
  page: number,
  limit: number,
): Promise<BackendResult<PagedResponse<ExploreBungItem>>> {
  const response = await fetch(`${context.apiBase}/v1/bungs?isAvailableOnly=false&page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      Authorization: context.accessToken,
    },
  })

  const data = (await response.json().catch(() => ({}))) as PagedResponse<ExploreBungItem>
  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

function dedupeSuggestionUsers(items: SuggestionUser[]): SuggestionUser[] {
  const map = new Map<string, SuggestionUser>()
  for (const item of items) {
    if (!item?.userId) continue
    if (!map.has(item.userId)) map.set(item.userId, item)
  }
  return Array.from(map.values())
}

function dedupeExploreBungs(items: ExploreBungItem[]): ExploreBungItem[] {
  const map = new Map<string, ExploreBungItem>()
  for (const item of items) {
    if (!item?.bungId) continue
    if (!map.has(item.bungId)) map.set(item.bungId, item)
  }
  return Array.from(map.values())
}

function dedupeChallenges(items: ChallengeItem[]): ChallengeItem[] {
  const map = new Map<number, ChallengeItem>()
  for (const item of items) {
    if (typeof item.challengeId !== 'number') continue
    if (!map.has(item.challengeId)) {
      map.set(item.challengeId, item)
    }
  }
  return Array.from(map.values())
}

function isClaimableChallenge(item: ChallengeItem): boolean {
  if (item.nftCompleted) return false
  if (item.accomplished === true) return true
  if (typeof item.currentCount === 'number' && typeof item.conditionCount === 'number') {
    return item.currentCount >= item.conditionCount
  }
  return false
}

function formatClaimableChallengeListReply(items: ChallengeItem[]): string {
  if (items.length === 0) return '지금 보상 받기 가능한 도전과제가 없어요.'

  const preview = items.slice(0, 8)
  const listed = preview.map((item, index) => `${index + 1}. ${item.challengeName}`).join('\n')
  const omitted = items.length - preview.length
  if (omitted > 0) {
    return `지금 보상 받기 가능한 도전과제는 총 ${items.length}개예요.\n${listed}\n...외 ${omitted}개`
  }
  return `지금 보상 받기 가능한 도전과제는 총 ${items.length}개예요.\n${listed}`
}

async function getClaimableChallenges(): Promise<{ ok: true; items: ChallengeItem[] } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  const [general, repetitive] = await Promise.all([
    callChallengeList(context.value, 'general', 0, 100),
    callChallengeList(context.value, 'repetitive', 0, 100),
  ])

  const successful = [general, repetitive].filter((result) => result.ok)
  if (successful.length === 0) {
    const status = general.status || repetitive.status || 500
    return { ok: false, message: mapStatusToReadError(status) }
  }

  const merged = successful.flatMap((result) => (Array.isArray(result.data.data) ? result.data.data : []))
  const claimable = dedupeChallenges(merged).filter(isClaimableChallenge)
  return { ok: true, items: claimable }
}

function formatCompletedChallengeListReply(items: ChallengeItem[]): string {
  if (items.length === 0) return '아직 완료한 도전과제가 없어요.'
  const preview = items.slice(0, 8)
  const listed = preview.map((item, index) => `${index + 1}. ${item.challengeName}`).join('\n')
  const omitted = items.length - preview.length
  if (omitted > 0) {
    return `완료한 도전과제는 총 ${items.length}개예요.\n${listed}\n...외 ${omitted}개`
  }
  return `완료한 도전과제는 총 ${items.length}개예요.\n${listed}`
}

async function getCompletedChallenges(): Promise<{ ok: true; items: ChallengeItem[] } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  const result = await callChallengeList(context.value, 'completed', 0, 100)
  if (!result.ok) return { ok: false, message: mapStatusToReadError(result.status) }
  const items = dedupeChallenges(Array.isArray(result.data.data) ? result.data.data : [])
  return { ok: true, items }
}

async function getChallengeSnapshot(): Promise<{ ok: true; items: ChallengeWithCategory[] } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  const [generalRes, repetitiveRes, completedRes] = await Promise.all([
    callChallengeList(context.value, 'general', 0, 100),
    callChallengeList(context.value, 'repetitive', 0, 100),
    callChallengeList(context.value, 'completed', 0, 100),
  ])

  const successful = [generalRes, repetitiveRes, completedRes].filter((result) => result.ok)
  if (successful.length === 0) {
    const status = generalRes.status || repetitiveRes.status || completedRes.status || 500
    return { ok: false, message: mapStatusToReadError(status) }
  }

  const toCategoryItems = (category: ChallengeCategory, source: BackendResult<PagedResponse<ChallengeItem>>): ChallengeWithCategory[] =>
    (Array.isArray(source.data.data) ? source.data.data : []).map((item) => ({ ...item, category }))

  const merged = [...toCategoryItems('general', generalRes), ...toCategoryItems('repetitive', repetitiveRes), ...toCategoryItems('completed', completedRes)]
  return { ok: true, items: merged }
}

function normalizeChallengeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\"'“”‘’「」『』]/g, '')
}

function stripChallengeTopicTokens(value: string): string {
  let text = value.trim()
  text = text.replace(/^(?:(?:아니\s*그러니까|그러니까|그중에서|중에서|중에|그중)\s*)+/i, '').trim()
  text = text.replace(/\s*(도전과제|챌린지)\s*$/i, '').trim()
  text = text.replace(/(이|가|을|를|은|는|의|에|에서)$/, '').trim()
  return text
}

function parseChallengeNameFromMessage(message: string): string | null {
  const quotedPattern = /[\"'“”‘’「」『』]([^\"'“”‘’「」『』]{2,40})[\"'“”‘’「」『』]/g
  const quoted = quotedPattern.exec(message)
  if (quoted && quoted[1]) {
    const candidate = stripChallengeTopicTokens(quoted[1])
    if (candidate.length >= 2) return candidate
  }

  const topicPattern = /([가-힣a-zA-Z0-9][가-힣a-zA-Z0-9\s]{1,40}?)\s*(도전과제|챌린지)/g
  const candidates: string[] = []
  let matched: RegExpExecArray | null
  while ((matched = topicPattern.exec(message)) !== null) {
    const raw = matched[1]
    if (!raw) {
      continue
    }
    const candidate = stripChallengeTopicTokens(raw)
    if (candidate.length < 2) {
      continue
    }
    if (['완료', '보상', '가능', '일반', '반복'].includes(candidate)) {
      continue
    }
    candidates.push(candidate)
  }
  return candidates.length > 0 ? candidates[candidates.length - 1] : null
}

function findChallengesByName(items: ChallengeWithCategory[], challengeName: string): ChallengeWithCategory[] {
  const target = normalizeChallengeName(challengeName)
  if (!target) return []

  const exact = items.filter((item) => normalizeChallengeName(item.challengeName) === target)
  if (exact.length > 0) return exact

  const partial = items.filter((item) => {
    const name = normalizeChallengeName(item.challengeName)
    return name.includes(target) || target.includes(name)
  })
  return partial
}

function dedupeChallengesById(items: ChallengeWithCategory[]): ChallengeWithCategory[] {
  const map = new Map<number, ChallengeWithCategory>()
  for (const item of items) {
    if (typeof item.challengeId !== 'number') continue
    const existing = map.get(item.challengeId)
    if (!existing) {
      map.set(item.challengeId, item)
      continue
    }

    const existingScore =
      (existing.nftCompleted ? 100 : 0) +
      (existing.accomplished ? 50 : 0) +
      (existing.category === 'completed' ? 10 : 0)
    const incomingScore =
      (item.nftCompleted ? 100 : 0) +
      (item.accomplished ? 50 : 0) +
      (item.category === 'completed' ? 10 : 0)
    if (incomingScore > existingScore) {
      map.set(item.challengeId, item)
    }
  }
  return Array.from(map.values())
}

function summarizeChallengeSnapshot(items: ChallengeWithCategory[]): ChallengeSummary {
  const general = dedupeChallengesById(items.filter((item) => item.category === 'general'))
  const repetitive = dedupeChallengesById(items.filter((item) => item.category === 'repetitive'))
  const completed = dedupeChallengesById(items.filter((item) => item.category === 'completed'))
  const claimable = dedupeChallengesById([...general, ...repetitive]).filter(isClaimableChallenge).length
  return {
    claimable,
    completed: completed.length,
    generalInProgress: general.length,
    repetitiveInProgress: repetitive.length,
  }
}

function detectChallengeMentionsFromSnapshot(items: ChallengeWithCategory[], message: string): ChallengeWithCategory[] {
  const normalizedMessage = normalizeChallengeName(message)
  if (!normalizedMessage) return []

  const matched = items
    .filter((item) => {
      const normalizedName = normalizeChallengeName(item.challengeName)
      return normalizedName.length >= 2 && normalizedMessage.includes(normalizedName)
    })
    .sort((a, b) => normalizeChallengeName(b.challengeName).length - normalizeChallengeName(a.challengeName).length)

  return dedupeChallengesById(matched)
}

function resolveNamedChallengeFromSnapshot(
  items: ChallengeWithCategory[],
  message: string,
  proposalChallengeName: string | null,
): ChallengeResolution {
  const candidateNames: string[] = []

  const pushCandidateName = (value: string | null) => {
    if (!value) return
    const normalized = stripChallengeTopicTokens(value)
    if (!normalized || normalized.length < 2) return
    if (candidateNames.some((item) => normalizeChallengeName(item) === normalizeChallengeName(normalized))) return
    candidateNames.push(normalized)
  }

  pushCandidateName(proposalChallengeName)
  pushCandidateName(parseChallengeNameFromMessage(message))

  const nameMatches: ChallengeWithCategory[] = []
  for (const candidate of candidateNames) {
    nameMatches.push(...findChallengesByName(items, candidate))
  }
  const dedupedNameMatches = dedupeChallengesById(nameMatches)
  if (dedupedNameMatches.length === 1) {
    return { status: 'resolved', query: candidateNames[0] ?? dedupedNameMatches[0].challengeName, target: dedupedNameMatches[0] }
  }
  if (dedupedNameMatches.length > 1) {
    return {
      status: 'ambiguous',
      query: candidateNames[0] ?? dedupedNameMatches[0].challengeName,
      candidates: dedupedNameMatches,
    }
  }

  const mentionMatches = detectChallengeMentionsFromSnapshot(items, message)
  if (mentionMatches.length === 1) {
    return { status: 'resolved', query: mentionMatches[0].challengeName, target: mentionMatches[0] }
  }
  if (mentionMatches.length > 1) {
    return {
      status: 'ambiguous',
      query: mentionMatches[0].challengeName,
      candidates: mentionMatches,
    }
  }

  if (candidateNames.length > 0) {
    return { status: 'not_found', query: candidateNames[0] }
  }
  return { status: 'missing_name' }
}

function buildChallengeAmbiguousReply(candidates: ChallengeWithCategory[]): string {
  const names = dedupeChallengesById(candidates)
    .slice(0, 5)
    .map((item, index) => `${index + 1}. ${item.challengeName}`)
    .join('\n')
  return `동일하거나 유사한 도전과제가 여러 개예요. 정확한 이름으로 다시 물어봐 주세요.\n${names}`
}

function buildNamedChallengeStatusReply(item: ChallengeWithCategory): string {
  const name = item.challengeName

  if (item.nftCompleted === true) {
    return `\`${name}\` 도전과제는 이미 보상 수령까지 완료된 상태예요.`
  }

  if (isClaimableChallenge(item)) {
    return `네, \`${name}\` 도전과제는 지금 완료(보상 받기) 가능한 상태예요.`
  }

  if (item.category === 'completed' || item.accomplished === true) {
    return `\`${name}\` 도전과제는 이미 완료된 상태예요.`
  }

  if (typeof item.currentCount === 'number' && typeof item.conditionCount === 'number') {
    const remain = Math.max(item.conditionCount - item.currentCount, 0)
    if (remain <= 0) {
      return `\`${name}\` 도전과제는 조건을 충족했어요. 지금 보상 받기로 완료 처리할 수 있어요.`
    }
    return `아직 \`${name}\` 도전과제는 완료 가능한 상태가 아니에요. 현재 ${item.currentCount}/${item.conditionCount} 진행 중이에요.`
  }

  return `\`${name}\` 도전과제의 현재 완료 가능 상태를 정확히 판단할 데이터가 부족해요. 도전과제 상세에서 조건을 확인해 주세요.`
}

async function getUserProfile(): Promise<{ ok: true; profile: UserProfile } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  const result = await callUserInfo(context.value)
  if (!result.ok) return { ok: false, message: mapStatusToReadError(result.status) }
  if (!result.data.data) return { ok: false, message: '사용자 정보를 찾지 못했어요.' }
  return { ok: true, profile: result.data.data }
}

async function getSuggestionUsers(): Promise<{ ok: true; items: SuggestionUser[] } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  const result = await callSuggestionUsers(context.value, 0, 30)
  if (!result.ok) return { ok: false, message: mapStatusToReadError(result.status) }
  const items = dedupeSuggestionUsers(Array.isArray(result.data.data) ? result.data.data : [])
  return { ok: true, items }
}

function formatSuggestionUsersReply(items: SuggestionUser[]): string {
  if (items.length === 0) return '자주 함께 뛴 추천 러너가 아직 없어요.'
  const preview = items.slice(0, 8)
  const listed = preview.map((item, index) => `${index + 1}. ${item.nickname} (${item.collabCount}회)`).join('\n')
  const omitted = items.length - preview.length
  if (omitted > 0) {
    return `추천 러너는 총 ${items.length}명이에요.\n${listed}\n...외 ${omitted}명`
  }
  return `추천 러너는 총 ${items.length}명이에요.\n${listed}`
}

async function getExploreBungItems(): Promise<{ ok: true; items: ExploreBungItem[] } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  const result = await callExploreBungs(context.value, 0, 50)
  if (!result.ok) return { ok: false, message: mapStatusToReadError(result.status) }
  const items = dedupeExploreBungs(Array.isArray(result.data.data) ? result.data.data : [])
  return { ok: true, items }
}

function formatExploreBungsReply(items: ExploreBungItem[]): string {
  if (items.length === 0) return '지금 탐색 가능한 벙이 없어요.'
  const preview = items.slice(0, 8)
  const listed = preview.map((item, index) => `${index + 1}. ${item.name}`).join('\n')
  const omitted = items.length - preview.length
  if (omitted > 0) {
    return `지금 탐색 가능한 벙은 총 ${items.length}개예요.\n${listed}\n...외 ${omitted}개`
  }
  return `지금 탐색 가능한 벙은 총 ${items.length}개예요.\n${listed}`
}

async function countMyBungsByStatus(
  context: ApiAuthContext,
  status: BungStatus,
): Promise<{ ok: true; count: number } | { ok: false; status: number }> {
  const result = await callMyBungs(context, status, 0, 1)
  if (!result.ok) return { ok: false, status: result.status }
  return {
    ok: true,
    count: typeof result.data.totalElements === 'number' ? result.data.totalElements : 0,
  }
}

async function getMyBungCount(scope: ReadScope): Promise<{ ok: true; count: number } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  if (scope === 'all') {
    const result = await countMyBungsByStatus(context.value, 'ALL')
    if (!result.ok) return { ok: false, message: mapStatusToReadError(result.status) }
    return { ok: true, count: result.count }
  }

  let total = 0
  for (const status of ['PARTICIPATING', 'ONGOING', 'PENDING'] as const) {
    const result = await countMyBungsByStatus(context.value, status)
    if (!result.ok) return { ok: false, message: mapStatusToReadError(result.status) }
    total += result.count
  }
  return { ok: true, count: total }
}

async function listMyBungsByStatus(
  context: ApiAuthContext,
  status: BungStatus,
): Promise<{ ok: true; items: MyBungWithStatus[]; total: number } | { ok: false; status: number }> {
  const PAGE_SIZE = 50
  const result = await callMyBungs(context, status, 0, PAGE_SIZE)
  if (!result.ok) return { ok: false, status: result.status }

  const rawItems = result.data.data ?? []
  const items = rawItems.map((item) => ({ ...item, status }))
  const total = typeof result.data.totalElements === 'number' ? result.data.totalElements : items.length
  return { ok: true, items, total }
}

function dedupeBungs(items: MyBungWithStatus[]): MyBungWithStatus[] {
  const map = new Map<string, MyBungWithStatus>()
  for (const item of items) {
    if (!item?.bungId) continue
    if (!map.has(item.bungId)) {
      map.set(item.bungId, item)
    }
  }
  return Array.from(map.values())
}

function formatBungNamesReply(scope: ReadScope, names: string[], total: number): string {
  if (total === 0 || names.length === 0) {
    return scope === 'active' ? '지금 참여 중인 벙이 없어요.' : '참여 중이거나 참여했던 벙이 없어요.'
  }

  const preview = names.slice(0, 8)
  const listed = preview.map((name, index) => `${index + 1}. ${name}`).join('\n')
  const omitted = total - preview.length

  if (scope === 'active') {
    return omitted > 0
      ? `지금 참여 중인 벙은 총 ${total}개예요.\n${listed}\n...외 ${omitted}개`
      : `지금 참여 중인 벙은 총 ${total}개예요.\n${listed}`
  }

  return omitted > 0
    ? `회원님이 참여 중이거나 참여했던 벙은 총 ${total}개예요.\n${listed}\n...외 ${omitted}개`
    : `회원님이 참여 중이거나 참여했던 벙은 총 ${total}개예요.\n${listed}`
}

async function getMyBungItems(scope: ReadScope): Promise<{ ok: true; items: MyBungWithStatus[] } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  const statuses: BungStatus[] = scope === 'active' ? ['PARTICIPATING', 'ONGOING', 'PENDING'] : ['ALL']
  const collected: MyBungWithStatus[] = []

  for (const status of statuses) {
    const result = await listMyBungsByStatus(context.value, status)
    if (!result.ok) return { ok: false, message: mapStatusToReadError(result.status) }
    collected.push(...result.items)
  }

  return {
    ok: true,
    items: dedupeBungs(collected),
  }
}

function makeBungListStatePatch(scope: ReadScope, items: MyBungWithStatus[]): ConversationStatePatch {
  return {
    entities: {
      bungs: toConversationEntities(items),
    },
    lastReadResult: {
      type: 'my_bungs_list',
      scope,
      total: items.length,
      timestamp: new Date().toISOString(),
    },
  }
}

function makeBungFocusPatch(bungId: string, scope: ReadScope, count?: number): ConversationStatePatch {
  return {
    focus: {
      lastBungId: bungId,
    },
    lastReadResult: {
      type: 'my_bung_member_count',
      scope,
      bungId,
      count,
      timestamp: new Date().toISOString(),
    },
  }
}

function resolveWithRef(
  ref: BungRef,
  candidates: ResolvedBung[],
  conversationState: ConversationState | null | undefined,
): ResolvedBung[] {
  if (ref.type === 'id') {
    return candidates.filter((item) => item.bungId === ref.value)
  }

  if (ref.type === 'index') {
    const n = Number(ref.value)
    if (!Number.isFinite(n) || n < 1) return []
    const byOrder = candidates.find((item) => item.order === n)
    if (byOrder) return [byOrder]
    const byIndex = candidates[n - 1]
    return byIndex ? [byIndex] : []
  }

  if (ref.type === 'deictic') {
    const focusId = conversationState?.focus?.lastBungId
    if (focusId) {
      const matched = candidates.find((item) => item.bungId === focusId)
      if (matched) return [matched]
    }
    return candidates.length > 0 ? [candidates[0]] : []
  }

  const target = normalizeTight(String(ref.value))
  const exact = candidates.filter((item) => normalizeTight(item.name) === target)
  if (exact.length > 0) return exact
  return candidates.filter((item) => normalizeTight(item.name).includes(target))
}

async function resolveTargetBung(
  proposal: ChatActionProposal,
  message: string,
  scope: ReadScope,
  conversationState: ConversationState | null | undefined,
): Promise<ResolveTargetResult> {
  const itemsResult = await getMyBungItems(scope)
  if (!itemsResult.ok) {
    return {
      ok: false,
      response: {
        kind: 'qa',
        reply: itemsResult.message,
        sources: [],
      },
    }
  }

  const entities = toConversationEntities(itemsResult.items)
  const candidates: ResolvedBung[] = entities.map((item) => ({ ...item }))
  const cachePatch = makeBungListStatePatch(scope, itemsResult.items)

  const directBungId = typeof proposal.params.bungId === 'string' ? proposal.params.bungId : undefined
  if (directBungId) {
    const matched = candidates.find((item) => item.bungId === directBungId)
    if (matched) {
      return {
        ok: true,
        target: matched,
        statePatch: mergeStatePatch(cachePatch, makeBungFocusPatch(matched.bungId, scope)) ?? cachePatch,
      }
    }
  }

  const proposalRef = parseBungRefFromUnknown(proposal.params.bungRef)
  const messageRef = parseBungRefFromMessage(message, conversationState)
  const stateRef = proposalRef ?? messageRef

  let matches: ResolvedBung[] = []
  if (stateRef) {
    matches = resolveWithRef(stateRef, candidates, conversationState)
  } else if (conversationState?.focus?.lastBungId) {
    matches = candidates.filter((item) => item.bungId === conversationState.focus?.lastBungId)
  }

  if (matches.length === 1) {
    return {
      ok: true,
      target: matches[0],
      statePatch: mergeStatePatch(cachePatch, makeBungFocusPatch(matches[0].bungId, scope)) ?? cachePatch,
    }
  }

  if (matches.length > 1) {
    return {
      ok: false,
      response: {
        kind: 'qa',
        reply: formatAmbiguousBungReply(matches),
        sources: [],
        statePatch: cachePatch,
      },
    }
  }

  const stateOnlyRef = parseBungRefFromUnknown(proposal.params.bungRef)
  const stateMatches = stateOnlyRef ? resolveFromState(stateOnlyRef, conversationState) : []
  if (stateMatches.length === 1) {
    const fromState = candidates.find((item) => item.bungId === stateMatches[0].bungId)
    if (fromState) {
      return {
        ok: true,
        target: fromState,
        statePatch: mergeStatePatch(cachePatch, makeBungFocusPatch(fromState.bungId, scope)) ?? cachePatch,
      }
    }
  }

  if (candidates.length === 1) {
    return {
      ok: true,
      target: candidates[0],
      statePatch: mergeStatePatch(cachePatch, makeBungFocusPatch(candidates[0].bungId, scope)) ?? cachePatch,
    }
  }

  return {
    ok: false,
    response: {
      kind: 'qa',
      reply:
        candidates.length > 0
          ? formatAmbiguousBungReply(candidates)
          : '대상 벙을 특정하지 못했어요. 벙 이름 또는 번호(예: 1번 벙)를 알려주세요.',
      sources: [],
      statePatch: cachePatch,
    },
  }
}

async function getBungMemberCount(
  bungId: string,
): Promise<{ ok: true; count: number; members: string[] } | { ok: false; message: string }> {
  const context = await getApiAuthContext()
  if (!context.ok) return context

  const result = await callBungDetail(context.value, bungId)
  if (!result.ok) {
    return {
      ok: false,
      message: mapStatusToReadError(result.status),
    }
  }

  const members = (result.data.data?.memberList ?? []).map((item) => item.nickname).filter((name) => Boolean(name))
  const fallbackCount = result.data.data?.currentMemberCount
  const count = members.length > 0 ? members.length : typeof fallbackCount === 'number' ? fallbackCount : 0

  return {
    ok: true,
    count,
    members,
  }
}

async function resolveReadProposal(
  assistant: ChatAssistantResponse,
  message: string,
  conversationState: ConversationState | null,
): Promise<ChatAssistantResponse | null> {
  const proposal = assistant.proposal
  if (!proposal || !READ_ACTIONS.has(proposal.actionKey)) return null

  if (looksLikeOtherPersonRequest(message)) {
    return {
      kind: 'qa',
      lane: 'qa',
      reply: '개인정보 보호 정책상 다른 사용자의 벙 정보는 확인할 수 없어요. 본인 정보만 안내할 수 있어요.',
      sources: [],
      statePatch: assistant.statePatch,
      uiHints: CHAT_UI_HINTS,
    }
  }

  const scope = parseScope(proposal, message)

  if (proposal.actionKey === 'read.weather.current') {
    const rawLocation =
      typeof proposal.params?.location === 'string' && proposal.params.location.trim() !== ''
        ? proposal.params.location.trim()
        : null

    if (!rawLocation) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: '어느 지역 날씨를 확인할까요? 예: 서울시 서대문구, 부산 해운대구',
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const weather = await fetchCurrentWeatherByLocation(rawLocation)
    if (!weather.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: weather.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const patch = mergeStatePatch(assistant.statePatch, {
      lastReadResult: {
        type: 'weather_current',
        scope: 'all',
        timestamp: new Date().toISOString(),
      },
    })

    return {
      kind: 'qa',
      lane: 'read',
      reply: `${rawLocation} 현재 날씨는 ${weather.condition}, 기온은 약 ${Math.round(weather.temperature)}°C예요.`,
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.challenge.claimable.count' || proposal.actionKey === 'read.challenge.claimable.list') {
    const challenges = await getClaimableChallenges()
    if (!challenges.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: challenges.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const patch = mergeStatePatch(assistant.statePatch, {
      lastReadResult: {
        type: 'challenge_claimable_list',
        total: challenges.items.length,
        timestamp: new Date().toISOString(),
      },
    })

    if (proposal.actionKey === 'read.challenge.claimable.count') {
      return {
        kind: 'qa',
        lane: 'read',
        reply: `지금 보상 받기 가능한 도전과제는 총 ${challenges.items.length}개예요.`,
        sources: [],
        statePatch: patch,
        uiHints: READ_UI_HINTS,
      }
    }

    return {
      kind: 'qa',
      lane: 'read',
      reply: formatClaimableChallengeListReply(challenges.items),
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.challenge.completed.count' || proposal.actionKey === 'read.challenge.completed.list') {
    const completed = await getCompletedChallenges()
    if (!completed.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: completed.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const patch = mergeStatePatch(assistant.statePatch, {
      lastReadResult: {
        type: 'challenge_completed_list',
        total: completed.items.length,
        timestamp: new Date().toISOString(),
      },
    })

    if (proposal.actionKey === 'read.challenge.completed.count') {
      return {
        kind: 'qa',
        lane: 'read',
        reply: `완료한 도전과제는 총 ${completed.items.length}개예요.`,
        sources: [],
        statePatch: patch,
        uiHints: READ_UI_HINTS,
      }
    }

    return {
      kind: 'qa',
      lane: 'read',
      reply: formatCompletedChallengeListReply(completed.items),
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.challenge.progress.summary') {
    const snapshot = await getChallengeSnapshot()
    if (!snapshot.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: snapshot.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const resolution = resolveNamedChallengeFromSnapshot(snapshot.items, message, null)
    if (resolution.status === 'resolved') {
      const patch = mergeStatePatch(assistant.statePatch, {
        lastReadResult: {
          type: 'challenge_named_status',
          challengeName: resolution.target.challengeName,
          challengeId: resolution.target.challengeId,
          timestamp: new Date().toISOString(),
        },
      })
      return {
        kind: 'qa',
        lane: 'read',
        reply: buildNamedChallengeStatusReply(resolution.target),
        sources: [],
        statePatch: patch,
        uiHints: READ_UI_HINTS,
      }
    }

    if (resolution.status === 'ambiguous') {
      return {
        kind: 'qa',
        lane: 'read',
        reply: buildChallengeAmbiguousReply(resolution.candidates),
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const summary = summarizeChallengeSnapshot(snapshot.items)
    const patch = mergeStatePatch(assistant.statePatch, {
      lastReadResult: {
        type: 'challenge_progress_summary',
        total: summary.generalInProgress + summary.repetitiveInProgress,
        timestamp: new Date().toISOString(),
      },
    })

    return {
      kind: 'qa',
      lane: 'read',
      reply:
        `도전과제 현황이에요.\n` +
        `- 진행 중(일반): ${summary.generalInProgress}개\n` +
        `- 진행 중(반복): ${summary.repetitiveInProgress}개\n` +
        `- 완료: ${summary.completed}개\n` +
        `- 보상 받기 가능: ${summary.claimable}개`,
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.challenge.by_name.status') {
    const nameFromParams =
      typeof proposal.params?.challengeName === 'string' && proposal.params.challengeName.trim() !== ''
        ? proposal.params.challengeName.trim()
        : null

    const snapshot = await getChallengeSnapshot()
    if (!snapshot.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: snapshot.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const resolution = resolveNamedChallengeFromSnapshot(snapshot.items, message, nameFromParams)
    if (resolution.status === 'missing_name') {
      return {
        kind: 'qa',
        lane: 'read',
        reply: '어떤 도전과제인지 이름을 알려주세요. 예: "프로필 완성하기 도전과제 완료 가능해?"',
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    if (resolution.status === 'not_found') {
      return {
        kind: 'qa',
        lane: 'read',
        reply: `\`${resolution.query}\` 도전과제를 찾지 못했어요. 이름을 다시 확인해 주세요.`,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    if (resolution.status === 'ambiguous') {
      return {
        kind: 'qa',
        lane: 'read',
        reply: buildChallengeAmbiguousReply(resolution.candidates),
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const target = resolution.target
    const patch = mergeStatePatch(assistant.statePatch, {
      lastReadResult: {
        type: 'challenge_named_status',
        challengeName: target.challengeName,
        challengeId: target.challengeId,
        timestamp: new Date().toISOString(),
      },
    })

    return {
      kind: 'qa',
      lane: 'read',
      reply: buildNamedChallengeStatusReply(target),
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.user.profile.summary') {
    const profile = await getUserProfile()
    if (!profile.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: profile.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }
    const patch = mergeStatePatch(assistant.statePatch, {
      lastReadResult: {
        type: 'user_profile_summary',
        timestamp: new Date().toISOString(),
      },
    })
    return {
      kind: 'qa',
      lane: 'read',
      reply:
        `회원님 프로필 요약이에요.\n` +
        `- 닉네임: ${profile.profile.nickname}\n` +
        `- 이메일: ${profile.profile.email}\n` +
        `- 로그인 방식: ${profile.profile.provider}\n` +
        `- 러닝 페이스: ${profile.profile.runningPace}\n` +
        `- 러닝 빈도: 주 ${profile.profile.runningFrequency}회`,
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.user.profile.nickname') {
    const profile = await getUserProfile()
    if (!profile.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: profile.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }
    return {
      kind: 'qa',
      lane: 'read',
      reply: `회원님 닉네임은 ${profile.profile.nickname}입니다.`,
      sources: [],
      statePatch: assistant.statePatch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.user.profile.email') {
    const profile = await getUserProfile()
    if (!profile.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: profile.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }
    return {
      kind: 'qa',
      lane: 'read',
      reply: `회원님 계정 이메일은 ${profile.profile.email}입니다.`,
      sources: [],
      statePatch: assistant.statePatch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.user.profile.wallet') {
    const profile = await getUserProfile()
    if (!profile.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: profile.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }
    return {
      kind: 'qa',
      lane: 'read',
      reply: `회원님 지갑 주소는 ${profile.profile.blockchainAddress}입니다.`,
      sources: [],
      statePatch: assistant.statePatch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.user.running.preferences') {
    const profile = await getUserProfile()
    if (!profile.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: profile.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }
    return {
      kind: 'qa',
      lane: 'read',
      reply: `회원님 러닝 설정은 페이스 ${profile.profile.runningPace}, 빈도 주 ${profile.profile.runningFrequency}회예요.`,
      sources: [],
      statePatch: assistant.statePatch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.user.suggestions.count' || proposal.actionKey === 'read.user.suggestions.list') {
    const suggestion = await getSuggestionUsers()
    if (!suggestion.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: suggestion.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    if (proposal.actionKey === 'read.user.suggestions.count') {
      return {
        kind: 'qa',
        lane: 'read',
        reply: `자주 함께 뛴 추천 러너는 총 ${suggestion.items.length}명이에요.`,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }
    return {
      kind: 'qa',
      lane: 'read',
      reply: formatSuggestionUsersReply(suggestion.items),
      sources: [],
      statePatch: assistant.statePatch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.bungs.explore.count' || proposal.actionKey === 'read.bungs.explore.names') {
    const bungs = await getExploreBungItems()
    if (!bungs.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: bungs.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    if (proposal.actionKey === 'read.bungs.explore.count') {
      return {
        kind: 'qa',
        lane: 'read',
        reply: `지금 탐색 가능한 벙은 총 ${bungs.items.length}개예요.`,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }
    return {
      kind: 'qa',
      lane: 'read',
      reply: formatExploreBungsReply(bungs.items),
      sources: [],
      statePatch: assistant.statePatch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.my_bungs.count') {
    const result = await getMyBungCount(scope)
    if (!result.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: result.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const patch = mergeStatePatch(assistant.statePatch, {
      lastReadResult: {
        type: 'my_bungs_count',
        scope,
        count: result.count,
        timestamp: new Date().toISOString(),
      },
    })

    return {
      kind: 'qa',
      lane: 'read',
      reply:
        scope === 'active'
          ? `지금 회원님이 참여 중인 벙은 총 ${result.count}개예요.`
          : `회원님이 참여 중이거나 참여했던 벙은 총 ${result.count}개예요.`,
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.my_bungs.names') {
    const result = await getMyBungItems(scope)
    if (!result.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: result.message,
        sources: [],
        statePatch: assistant.statePatch,
        uiHints: READ_UI_HINTS,
      }
    }

    const names = result.items.map((item) => item.name).filter((name) => typeof name === 'string' && name.trim() !== '')
    const patch = mergeStatePatch(assistant.statePatch, makeBungListStatePatch(scope, result.items))

    return {
      kind: 'qa',
      lane: 'read',
      reply: formatBungNamesReply(scope, names, result.items.length),
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  if (proposal.actionKey === 'read.my_bung.member_count' || proposal.actionKey === 'read.my_bung.members') {
    const target = await resolveTargetBung(proposal, message, scope, conversationState)
    if (!target.ok) {
      const responseWithPatch = {
        ...target.response,
        lane: target.response.lane ?? 'read',
        uiHints: target.response.uiHints ?? READ_UI_HINTS,
        statePatch: mergeStatePatch(target.response.statePatch, assistant.statePatch),
      }
      return responseWithPatch
    }

    const memberResult = await getBungMemberCount(target.target.bungId)
    if (!memberResult.ok) {
      return {
        kind: 'qa',
        lane: 'read',
        reply: memberResult.message,
        sources: [],
        statePatch: mergeStatePatch(target.statePatch, assistant.statePatch),
        uiHints: READ_UI_HINTS,
      }
    }

    const patch = mergeStatePatch(
      mergeStatePatch(target.statePatch, assistant.statePatch),
      makeBungFocusPatch(target.target.bungId, scope, memberResult.count),
    )

    if (proposal.actionKey === 'read.my_bung.members') {
      const membersText =
        memberResult.members.length > 0
          ? memberResult.members.slice(0, 12).map((name, index) => `${index + 1}. ${name}`).join('\n')
          : '참여 중인 멤버 이름을 확인하지 못했어요.'
      return {
        kind: 'qa',
        lane: 'read',
        reply: `${target.target.name} 벙의 참여자는 총 ${memberResult.count}명이에요.\n${membersText}`,
        sources: [],
        statePatch: patch,
        uiHints: READ_UI_HINTS,
      }
    }

    return {
      kind: 'qa',
      lane: 'read',
      reply: `${target.target.name} 벙의 참여자는 현재 ${memberResult.count}명이에요.`,
      sources: [],
      statePatch: patch,
      uiHints: READ_UI_HINTS,
    }
  }

  return {
    kind: 'qa',
    lane: 'read',
    reply: '아직 지원하지 않는 조회 요청이에요.',
    sources: [],
    statePatch: assistant.statePatch,
    uiHints: READ_UI_HINTS,
  }
}

/**
 * POST /api/chat
 * body: { question: string } 또는 { message, history, pendingAction, conversationState }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = typeof body.message === 'string' ? body.message : undefined
    const question = typeof body.question === 'string' ? body.question : undefined
    const history = Array.isArray(body.history) ? (body.history as ChatHistoryItem[]) : []
    const pendingAction =
      body.pendingAction != null && typeof body.pendingAction === 'object' ? body.pendingAction : null
    const conversationState =
      body.conversationState != null && typeof body.conversationState === 'object'
        ? (body.conversationState as ConversationState)
        : null

    const finalMessage = (message ?? question ?? '').trim()
    if (!finalMessage) return NextResponse.json({ error: '질문을 입력해주세요' }, { status: 400 })

    const botServerUrl = process.env.BOT_SERVER_URL
    if (!botServerUrl) {
      return NextResponse.json({ error: '봇 서버가 설정되지 않았습니다' }, { status: 500 })
    }

    const useAssistant = message != null || history.length > 0 || pendingAction != null || conversationState != null
    const targetPath = useAssistant ? '/rag/assistant' : '/rag/query'
    const targetPayload = useAssistant
      ? {
          message: finalMessage,
          history: history.slice(-20),
          pendingAction,
          conversationState,
        }
      : { question: finalMessage }

    const response = await fetch(`${botServerUrl}${targetPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targetPayload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({ error: errorData.detail || '봇 서버 응답 오류' }, { status: response.status })
    }

    const data = await response.json()

    if (useAssistant && isAssistantResponse(data)) {
      if (data.lane === 'chat' || data.kind === 'chat') {
        return NextResponse.json({
          ...data,
          lane: 'chat',
          uiHints: data.uiHints ?? CHAT_UI_HINTS,
        })
      }
      const resolved = await resolveReadProposal(data, finalMessage, conversationState)
      if (resolved) return NextResponse.json(resolved)
      return NextResponse.json({
        ...data,
        uiHints: data.uiHints ?? (data.lane === 'qa' ? QA_UI_HINTS : CHAT_UI_HINTS),
      })
    }

    if (!useAssistant && isLegacyResponse(data)) {
      return NextResponse.json(data)
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '챗봇 응답 실패' }, { status: 500 })
  }
}
