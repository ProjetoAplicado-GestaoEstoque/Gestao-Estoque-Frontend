import { Roles } from '@/modules/auth/types/types'
import { IUserCredentials } from '@/types/types'
import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'

interface IUser {
  user: IUserCredentials
  setUser: (user: IUserCredentials) => void
  clearUser: () => void
}

export const useUser = create<IUser>()(
  persist<IUser>(
    (set) => ({
      user: {
        userID: '',
        full_name: '',
        email: '',
        role: '' as Roles,
      },
      setUser: (user: IUserCredentials) => set({ user }),
      clearUser: () => set({}),
    }),
    {
      name: 'user-storage',
    } as PersistOptions<IUser>,
  ),
)
