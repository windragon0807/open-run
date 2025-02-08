import { create } from 'zustand'
import { UserInfo } from '@type/user'

type User = {
  userInfo: UserInfo | null
  setUserInfo: (userInfo: UserInfo) => void
}

export const useUserStore = create<User>()((set) => ({
  userInfo: null,
  setUserInfo: (userInfo: UserInfo) => set(() => ({ userInfo })),
}))
