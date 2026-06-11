export type ApiErrorCause = {
  url: string
  method: string
  status: number
  statusText: string
  body: unknown
}

export class ApiError extends Error {
  readonly url: string
  readonly method: string
  readonly status: number
  readonly statusText: string
  readonly body: unknown
  readonly response: {
    status: number
    statusText: string
    data: unknown
  }

  constructor(cause: ApiErrorCause) {
    super(getApiErrorMessage(cause.body) ?? `[API] ${cause.method} ${cause.url} failed with ${cause.status}`)
    this.name = 'ApiError'
    this.url = cause.url
    this.method = cause.method
    this.status = cause.status
    this.statusText = cause.statusText
    this.body = cause.body
    this.response = {
      status: cause.status,
      statusText: cause.statusText,
      data: cause.body,
    }
  }
}

export function getApiErrorMessage(error: unknown): string | undefined {
  if (error instanceof ApiError) {
    return getMessageFromBody(error.body) ?? error.message
  }

  return getMessageFromBody(error)
}

function getMessageFromBody(body: unknown): string | undefined {
  if (body == null || typeof body !== 'object') return undefined
  const message = (body as { message?: unknown }).message
  return typeof message === 'string' ? message : undefined
}
