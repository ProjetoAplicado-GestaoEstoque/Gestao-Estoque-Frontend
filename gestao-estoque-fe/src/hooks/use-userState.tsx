import { create } from 'zustand'

export const useUserState = create((set) => ({
  user_id: '',
  setUserId: (id: string) => set({ user_id: id }),
}))
