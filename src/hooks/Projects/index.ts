import { axiosInstance } from '@/axios/api'
import {
  CustomQueryOptions,
  ErrorQueryOptions,
  IProjects,
  Projects,
} from '../../types/types'
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

export const useProjectsQueryById = (
  projectID: string,
  options?: CustomQueryOptions<IProjects, ErrorQueryOptions>,
) => {
  return useQuery<IProjects, ErrorQueryOptions>({
    queryKey: ['projectID', projectID],
    queryFn: () =>
      axiosInstance
        .get<IProjects>(`/api/items/${projectID}`)
        .then((resp) => resp.data),
    ...options,
  })
}
