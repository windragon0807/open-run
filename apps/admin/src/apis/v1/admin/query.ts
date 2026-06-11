import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@openrun/types'
import {
  AdminChallengeResponse,
  AdminChallengesResponse,
  AdminMeResponse,
  AdminNftAvatarItemsResponse,
  AdminNftAvatarTryOnItemsResponse,
  AdminUsersResponse,
  fetchAdminChallenge,
  fetchAdminChallenges,
  fetchAdminMe,
  fetchAdminNftAvatarItems,
  fetchAdminNftAvatarTryOnItems,
  fetchAdminUsers,
} from './index'

export const adminQueries = {
  me: () =>
    queryOptions({
      queryKey: ['admin', 'me'] as const,
      queryFn: fetchAdminMe,
      staleTime: Infinity,
      gcTime: Infinity,
    }),
  users: () =>
    queryOptions({
      queryKey: ['admin', 'users'] as const,
      queryFn: fetchAdminUsers,
    }),
  nftAvatarItems: () =>
    queryOptions({
      queryKey: ['admin', 'nftAvatarItems'] as const,
      queryFn: fetchAdminNftAvatarItems,
    }),
  nftAvatarTryOnItems: () =>
    queryOptions({
      queryKey: ['admin', 'nftAvatarTryOnItems'] as const,
      queryFn: fetchAdminNftAvatarTryOnItems,
    }),
  challenges: () =>
    queryOptions({
      queryKey: ['admin', 'challenges'] as const,
      queryFn: fetchAdminChallenges,
    }),
  challenge: (challengeId: number) =>
    queryOptions({
      queryKey: ['admin', 'challenges', challengeId] as const,
      queryFn: () => fetchAdminChallenge(challengeId),
    }),
}

export function useAdminMeQuery(options?: QueryOptions<ReturnType<typeof adminQueries.me>>) {
  return useQuery({
    ...adminQueries.me(),
    ...options,
  })
}

export function useAdminNftAvatarItemsQuery(options?: QueryOptions<ReturnType<typeof adminQueries.nftAvatarItems>>) {
  return useQuery({
    ...adminQueries.nftAvatarItems(),
    ...options,
  })
}

export function useAdminNftAvatarTryOnItemsQuery(
  options?: QueryOptions<ReturnType<typeof adminQueries.nftAvatarTryOnItems>>,
) {
  return useQuery({
    ...adminQueries.nftAvatarTryOnItems(),
    ...options,
  })
}

export function useAdminUsersQuery(options?: QueryOptions<ReturnType<typeof adminQueries.users>>) {
  return useQuery({
    ...adminQueries.users(),
    ...options,
  })
}

export function useAdminChallengesQuery(options?: QueryOptions<ReturnType<typeof adminQueries.challenges>>) {
  return useQuery({
    ...adminQueries.challenges(),
    ...options,
  })
}

export function useAdminChallengeQuery(
  challengeId: number,
  options?: QueryOptions<ReturnType<typeof adminQueries.challenge>>,
) {
  return useQuery({
    ...adminQueries.challenge(challengeId),
    ...options,
  })
}
