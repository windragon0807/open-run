import { ApiError } from './error'

export type HttpParams = Record<string, unknown> | URLSearchParams

export type HttpConfig = Omit<RequestInit, 'body' | 'method'> & {
  params?: HttpParams
}

export type HttpClientOptions = {
  baseURL?: string
  getHeaders?: () => HeadersInit | undefined | Promise<HeadersInit | undefined>
  fetcher?: typeof fetch
}

export function createHttpClient({ baseURL, getHeaders, fetcher = fetch }: HttpClientOptions = {}) {
  async function request<T>(
    method: string,
    path: string,
    data?: unknown,
    config: HttpConfig = {},
  ): Promise<T> {
    const { params, headers: configHeaders, ...requestConfig } = config
    const url = buildUrl(baseURL, path, params)
    const headers = new Headers(configHeaders)
    mergeHeaders(headers, await getHeaders?.())
    const body = createBody(data, headers)

    const response = await fetcher(url, {
      ...requestConfig,
      method,
      headers,
      body,
    })

    return parseResponse<T>(response, method, url)
  }

  return {
    get: <T>(path: string, config?: HttpConfig) => request<T>('GET', path, undefined, config),
    delete: <T>(path: string, config?: HttpConfig) => request<T>('DELETE', path, undefined, config),
    post: <T>(path: string, data?: unknown, config?: HttpConfig) => request<T>('POST', path, data, config),
    put: <T>(path: string, data?: unknown, config?: HttpConfig) => request<T>('PUT', path, data, config),
    patch: <T>(path: string, data?: unknown, config?: HttpConfig) => request<T>('PATCH', path, data, config),
  }
}

function buildUrl(baseURL: string | undefined, path: string, params: HttpParams | undefined) {
  const isAbsoluteUrl = /^https?:\/\//.test(path)
  const rawUrl = isAbsoluteUrl || baseURL == null ? path : new URL(path, baseURL).toString()
  if (params == null) return rawUrl

  const parsedUrl = new URL(rawUrl, isAbsoluteUrl || baseURL != null ? undefined : 'http://openrun.local')
  appendParams(parsedUrl.searchParams, params)

  if (isAbsoluteUrl || baseURL != null) return parsedUrl.toString()
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
}

function appendParams(searchParams: URLSearchParams, params: HttpParams) {
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      searchParams.append(key, value)
    })
    return
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item != null) searchParams.append(key, String(item))
      })
      return
    }

    searchParams.set(key, String(value))
  })
}

function mergeHeaders(headers: Headers, extraHeaders: HeadersInit | undefined) {
  if (extraHeaders == null) return
  new Headers(extraHeaders).forEach((value, key) => headers.set(key, value))
}

function createBody(data: unknown, headers: Headers): BodyInit | undefined {
  if (data == null) return undefined
  if (data instanceof FormData) return data
  if (data instanceof Blob) return data
  if (data instanceof URLSearchParams) return data
  if (typeof data === 'string') return data

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return JSON.stringify(data)
}

async function parseResponse<T>(response: Response, method: string, url: string): Promise<T> {
  const body = await parseBody(response)

  if (!response.ok) {
    throw new ApiError({
      url,
      method,
      status: response.status,
      statusText: response.statusText,
      body,
    })
  }

  return body as T
}

async function parseBody(response: Response) {
  if (response.status === 204) return undefined

  const text = await response.text()
  if (text.length === 0) return undefined

  const contentType = response.headers.get('Content-Type') ?? ''
  if (!contentType.includes('application/json')) return text

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
