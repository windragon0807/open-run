import { useMutation } from 'react-query'
import { fetchGeocoding } from './index'

export function useGeocoding() {
  return useMutation({
    mutationFn: fetchGeocoding,
  })
}
