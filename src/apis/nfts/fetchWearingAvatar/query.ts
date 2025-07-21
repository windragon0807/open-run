import { useQuery } from 'react-query'
import { fetchWearingAvatar } from './index'

export function useWearingAvatar() {
  return useQuery({
    queryKey: ['wearing-avatar'],
    queryFn: fetchWearingAvatar,
    select: (data) => data.data,
  })
}
