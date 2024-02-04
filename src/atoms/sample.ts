import { atom } from 'recoil'
import { User } from '@models/user'

/**
 * Sample
 * 1. 상태 변경
 *   const setUser = useSetRecoilState(userAtom);
 * 2. 상태 참조
 *   const user = useRecoilValue(userAtom);
 * 3. useState 처럼 사용
 *   const [user, setUser] = useRecoilState(userAtom);
 */
export const userAtom = atom<User | null>({
  key: 'auth/User',
  default: null,
})

export const countAtom = atom<number>({
  key: 'count',
  default: 0,
})
