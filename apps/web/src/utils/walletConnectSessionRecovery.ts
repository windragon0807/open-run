const RECOVERABLE_ERROR_PATTERNS = [
  ['missing or invalid', 'record was recently deleted', 'session'],
  ['no matching key'],
] as const

const WALLETCONNECT_STORAGE_KEY_PATTERNS = [
  'walletconnect',
  'wc@2',
  'appkit',
  'reown',
  'wagmi',
  'w3m',
  'recentwallet',
] as const

type BrowserStorageName = 'localStorage' | 'sessionStorage'

export type RemovedWalletConnectStorageKey = {
  storage: BrowserStorageName
  key: string
}

export const RECOVERED_WALLETCONNECT_SESSION_MESSAGE = '지갑 연결 세션을 정리했어요. 다시 시도해 주세요.'

function stringifyError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }

  if (typeof error === 'string') {
    return error
  }

  if (error != null && typeof error === 'object') {
    const maybeError = error as {
      cause?: unknown
      message?: unknown
      reason?: unknown
      shortMessage?: unknown
    }
    const parts = [maybeError.message, maybeError.shortMessage, maybeError.reason, maybeError.cause]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)

    if (parts.length > 0) {
      return parts.join(' ')
    }
  }

  try {
    return JSON.stringify(error) ?? String(error)
  } catch {
    return String(error)
  }
}

export function isRecoverableWalletConnectSessionError(error: unknown): boolean {
  const normalizedError = stringifyError(error).toLowerCase()

  return RECOVERABLE_ERROR_PATTERNS.some((patterns) =>
    patterns.every((pattern) => normalizedError.includes(pattern)),
  )
}

function isWalletConnectSessionStorageKey(key: string): boolean {
  const normalizedKey = key.toLowerCase()

  return WALLETCONNECT_STORAGE_KEY_PATTERNS.some((pattern) => normalizedKey.includes(pattern))
}

function getBrowserStorage(storageName: BrowserStorageName): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window[storageName]
  } catch {
    return null
  }
}

function getStorageKeys(storage: Storage): string[] {
  const keys: string[] = []

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)

    if (key != null) {
      keys.push(key)
    }
  }

  return keys
}

export function clearWalletConnectSessionStorage(): RemovedWalletConnectStorageKey[] {
  const removedKeys: RemovedWalletConnectStorageKey[] = []
  const storageNames: BrowserStorageName[] = ['localStorage', 'sessionStorage']

  storageNames.forEach((storageName) => {
    const storage = getBrowserStorage(storageName)

    if (storage == null) {
      return
    }

    getStorageKeys(storage)
      .filter(isWalletConnectSessionStorageKey)
      .forEach((key) => {
        try {
          storage.removeItem(key)
          removedKeys.push({ storage: storageName, key })
        } catch {
          // Storage can be unavailable in private mode; failing to clear should not break the login UI.
        }
      })
  })

  return removedKeys
}
