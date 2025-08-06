import { useMutation } from '@tanstack/react-query'
import { deleteUser } from './index'

export function useDeleteUser() {
  return useMutation({
    mutationFn: deleteUser,
  })
}
