export type BungInfo = {
  bungId: string
  mainImage: string | null
  name: string
  description: string
  location: string
  latitude: number
  longitude: number
  startDateTime: string
  endDateTime: string
  distance: number
  pace: string
  memberNumber: number
  currentMemberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
  memberList: BungMember[]
}

export type BungMember = {
  userId: string
  nickname: string
  email: string
  profileImageUrl: string
  likeCount: number
  participationStatus: boolean
  owner: boolean
}
