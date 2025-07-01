import { axiosInstance } from '@/axios/api'
import { ErrorQueryOptions, IProjects } from '../types/types'
import { QueryOptions, useQuery } from '@tanstack/react-query'

export const useProjects = (
  options?: QueryOptions<IProjects[], ErrorQueryOptions>,
) => {
  return useQuery<IProjects[], ErrorQueryOptions>({
    queryKey: ['project'],
    queryFn: async () => {
      return await axiosInstance.get('/api/project').then((resp) => {
        return resp.data?.projects
      })
    },
    ...options,
  })
}
