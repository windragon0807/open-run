'use client'

import { type Insets, useAppStore } from '@store/app'

export type AppInsetEdge = keyof Insets

export function getAppInsetSize({
  base,
  edge,
  insets,
  isApp,
}: {
  base: number
  edge: AppInsetEdge
  insets: Insets | null
  isApp: boolean
}) {
  return base + (isApp ? (insets?.[edge] ?? 0) : 0)
}

export function getAppInsetValue({
  edge,
  insets,
  isApp,
}: {
  edge: AppInsetEdge
  insets: Insets | null
  isApp: boolean
}) {
  return isApp ? (insets?.[edge] ?? 0) : 0
}

export function useAppInsetValue(edge: AppInsetEdge) {
  const { isApp, insets } = useAppStore()

  return getAppInsetValue({ edge, insets, isApp })
}

export default function useAppInsetSize(edge: AppInsetEdge, base: number) {
  const { isApp, insets } = useAppStore()

  return getAppInsetSize({ base, edge, insets, isApp })
}
