import type { BungMember } from '@type/bung'

export function sortBungMembersOwnerFirst(memberList: BungMember[]) {
  return memberList
    .map((member, index) => ({ member, index }))
    .sort((a, b) => Number(b.member.owner) - Number(a.member.owner) || a.index - b.index)
    .map(({ member }) => member)
}
