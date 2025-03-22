import { create } from 'zustand'

export const useToken = create((set) => ({
  token: '',
  setToken: (token: string) => set({ token }),
}))
