import { axiosInstance } from '@/axios/api'
import { ErrorQueryOptions, IUserCredentials } from '../types/types'
import { QueryOptions, useQuery } from '@tanstack/react-query'

export const useCurrentUser = (
  userID: string,
  options?: QueryOptions<IUserCredentials, ErrorQueryOptions>,
) => {
  return useQuery<IUserCredentials, ErrorQueryOptions>({
    queryKey: ['userID', userID],
    queryFn: () => {
      return axiosInstance.get(`/api/user/${userID}`).then((resp) => {
        return resp.data
      })
    },
    ...options,
  })
}
