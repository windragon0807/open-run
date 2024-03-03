import { useQuery } from 'react-query'

import getSample from './api'

export const getSampleKey = () => ['sample']
export function useSample() {
  return useQuery({
    queryKey: getSampleKey(),
    queryFn: getSample,
  })
}
