import assert from 'node:assert/strict'
import { sortBungMembersOwnerFirst } from './sortBungMembersOwnerFirst'

type TestBungMember = Parameters<typeof sortBungMembersOwnerFirst>[0][number]

const createMember = (userId: string, owner: boolean): TestBungMember => ({
  userId,
  nickname: userId,
  email: `${userId}@openrun.test`,
  profileImageUrl: null,
  likeCount: 0,
  participationStatus: true,
  owner,
})

const members = [createMember('participant-1', false), createMember('owner', true), createMember('participant-2', false)]

assert.deepEqual(
  sortBungMembersOwnerFirst(members).map((member) => member.userId),
  ['owner', 'participant-1', 'participant-2'],
)
assert.deepEqual(
  members.map((member) => member.userId),
  ['participant-1', 'owner', 'participant-2'],
)
