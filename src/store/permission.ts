import { create } from 'zustand'

type Permission = {
  geolocation: boolean
  setGeolocation: (geolocation: boolean) => void
}

export const usePermissionStore = create<Permission>()((set) => ({
  geolocation: false,
  setGeolocation: (geolocation: boolean) => set(() => ({ geolocation })),
}))
