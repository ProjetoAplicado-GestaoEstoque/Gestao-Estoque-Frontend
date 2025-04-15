import { axiosInstance } from '@/axios/api'
import { ErrorQueryOptions, IProjects, Projects } from '@/types/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export const useProjects = (
  options?: UseQueryOptions<IProjects[], ErrorQueryOptions>,
) => {
  return useQuery<IProjects[], ErrorQueryOptions>({
    queryKey: ['project'],
    queryFn: async () => {
      return await axiosInstance.get<Projects>('/api/project').then((resp) => {
        return resp.data?.projects
      })
    },
    ...options,
  })
}

/* export const useProjectById = (projectID: string) => {
  return useQuery({
    enabled: !!projectID,
    queryKey: ['projectId', projectID],
  })
} */
