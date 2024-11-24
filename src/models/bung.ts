export type BungDetail = {
  bungId: string
  name: string
  description: string
  location: string
  startDateTime: string
  endDateTime: string
  distance: number
  pace: string
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
  memberList: Array<{
    userId: string
    nickname: string
    email: string
    userBungId: number
    participationStatus: boolean
    owner: boolean
  }>
}
