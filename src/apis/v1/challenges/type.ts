export type ChallengeInfo = {
  challengeId: number
  userChallengeId: number
  challengeName: string
  completedDate: string | null
  challengeDescription: string
  currentCount: number
  conditionCount: number
  conditionDate: string | null
  conditionText: string | null
  challengeType: string
  completedType: string
  stageCount: number
  progressStat: number
  accomplished: boolean
  nftCompleted: boolean
}
