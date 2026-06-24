import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import {
  OwnedNftAvatarItemsResponse,
  WearingNftAvatarResponse,
  fetchOwnedNftAvatarItems,
  fetchWearingNftAvatar,
} from './index'

export const OWNED_NFT_AVATAR_ITEMS_STALE_TIME_MS = 1000 * 60 * 5
export const OWNED_NFT_AVATAR_ITEMS_GC_TIME_MS = 1000 * 60 * 10

export const nftAvatarQueries = {
  ownedItems: () =>
    queryOptions({
      queryKey: ['nftAvatarItems', 'me'] as const,
      queryFn: fetchOwnedNftAvatarItems,
      staleTime: OWNED_NFT_AVATAR_ITEMS_STALE_TIME_MS,
      gcTime: OWNED_NFT_AVATAR_ITEMS_GC_TIME_MS,
    }),
  wearing: () =>
    queryOptions({
      queryKey: ['nftAvatarItems', 'wearing', 'me'] as const,
      queryFn: fetchWearingNftAvatar,
      staleTime: Infinity,
      gcTime: Infinity,
    }),
}

export function getOwnedNftAvatarItemsQueryOptions() {
  return nftAvatarQueries.ownedItems()
}

export function getWearingNftAvatarQueryOptions() {
  return nftAvatarQueries.wearing()
}

export function useOwnedNftAvatarItemsQuery(options?: QueryOptions<ReturnType<typeof nftAvatarQueries.ownedItems>>) {
  return useQuery({
    ...nftAvatarQueries.ownedItems(),
    ...options,
  })
}

export function useWearingNftAvatarQuery(options?: QueryOptions<ReturnType<typeof nftAvatarQueries.wearing>>) {
  return useQuery({
    ...nftAvatarQueries.wearing(),
    ...options,
  })
}

export function useSuspenseOwnedNftAvatarItemsQuery() {
  return useSuspenseQuery(nftAvatarQueries.ownedItems())
}

export function useSuspenseWearingNftAvatarQuery() {
  return useSuspenseQuery(nftAvatarQueries.wearing())
}
