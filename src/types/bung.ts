export type BungInfo = {
  bungId: string
  name: string
  description: string
  location: string
  startDateTime: Date
  endDateTime: Date
  distance: number
  pace: string
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
  memberList: BungMember[]
}

export type BungMember = {
  userId: string
  nickname: string
  email: string
  userBungId: number
  participationStatus: boolean
  owner: boolean
}
