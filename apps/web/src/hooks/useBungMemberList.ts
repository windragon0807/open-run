import { useBungDetailQuery } from '@apis/v1/bungs/[bungId]/query'

export default function useBungMemberList(bungId: string) {
  const query = useBungDetailQuery({ bungId })

  return {
    ...query,
    memberList: query.data?.data.memberList ?? [],
  }
}
