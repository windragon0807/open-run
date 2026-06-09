import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import {
  OwnedNftAvatarItemsResponse,
  WearingNftAvatarResponse,
  fetchOwnedNftAvatarItems,
  fetchWearingNftAvatar,
} from './index'

export const OWNED_NFT_AVATAR_ITEMS_QUERY_KEY = ['nftAvatarItems', 'me'] as const
export const WEARING_NFT_AVATAR_QUERY_KEY = ['nftAvatarItems', 'wearing', 'me'] as const
export const OWNED_NFT_AVATAR_ITEMS_STALE_TIME_MS = 1000 * 60 * 5
export const OWNED_NFT_AVATAR_ITEMS_GC_TIME_MS = 1000 * 60 * 10

export function getOwnedNftAvatarItemsQueryOptions() {
  return {
    queryKey: OWNED_NFT_AVATAR_ITEMS_QUERY_KEY,
    queryFn: fetchOwnedNftAvatarItems,
    staleTime: OWNED_NFT_AVATAR_ITEMS_STALE_TIME_MS,
    gcTime: OWNED_NFT_AVATAR_ITEMS_GC_TIME_MS,
  }
}

export function useOwnedNftAvatarItemsQuery(options?: QueryOptions<OwnedNftAvatarItemsResponse>) {
  return useQuery({
    ...getOwnedNftAvatarItemsQueryOptions(),
    ...options,
  })
}

export function useWearingNftAvatarQuery(options?: QueryOptions<WearingNftAvatarResponse>) {
  return useQuery({
    queryKey: WEARING_NFT_AVATAR_QUERY_KEY,
    queryFn: fetchWearingNftAvatar,
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  })
}

export function useSuspenseOwnedNftAvatarItemsQuery() {
  return useSuspenseQuery({
    ...getOwnedNftAvatarItemsQueryOptions(),
  })
}

export function useSuspenseWearingNftAvatarQuery() {
  return useSuspenseQuery({
    queryKey: WEARING_NFT_AVATAR_QUERY_KEY,
    queryFn: fetchWearingNftAvatar,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
