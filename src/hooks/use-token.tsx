import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'

interface TokenState {
  token: string
  setToken: (token: string) => void
  clearToken: () => void
}

export const useToken = create<TokenState>()(
  persist<TokenState>(
    (set) => ({
      token: '',
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: '' }),
    }),
    {
      name: 'token-storage',
    } as PersistOptions<TokenState>,
  ),
)
