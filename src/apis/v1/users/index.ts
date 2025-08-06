import http from '@apis/axios'

export function deleteUser() {
  return http.delete('/v1/users')
}
