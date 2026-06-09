import { Avatar, WearingAvatar } from '@type/avatar'
import http from '@apis/axios'
import { ApiResponse } from '@apis/type'

export type OwnedNftAvatarItemsResponse = ApiResponse<Avatar[]>

export type WearingNftAvatarResponse = ApiResponse<WearingAvatar>

export type SaveWearingNftAvatarRequest = {
  fullSet: string | null
  upperClothing: string | null
  lowerClothing: string | null
  footwear: string | null
  face: string | null
  skin: string | null
  hair: string | null
  accessories: {
    'head-accessories': string | null
    'eye-accessories': string | null
    'ear-accessories': string | null
    'body-accessories': string | null
  }
}

export type SaveWearingNftAvatarWithProfileImageRequest = {
  wearingAvatar: SaveWearingNftAvatarRequest
  profileImage: Blob
}

export function fetchOwnedNftAvatarItems(): Promise<OwnedNftAvatarItemsResponse> {
  return http.get('/v1/nft/avatar-items/me')
}

export function fetchWearingNftAvatar(): Promise<WearingNftAvatarResponse> {
  return http.get('/v1/nft/avatar-items/me/wearing')
}

export function saveWearingNftAvatarWithProfileImage(
  request: SaveWearingNftAvatarWithProfileImageRequest,
): Promise<WearingNftAvatarResponse> {
  const formData = new FormData()
  const profileImage =
    request.profileImage instanceof File
      ? request.profileImage
      : new File([request.profileImage], 'profile.png', { type: 'image/png' })

  formData.append(
    'wearingAvatar',
    new Blob([JSON.stringify(request.wearingAvatar)], {
      type: 'application/json',
    }),
  )
  formData.append('image', profileImage)

  return http.put('/v1/nft/avatar-items/me/wearing/profile-image', formData)
}
