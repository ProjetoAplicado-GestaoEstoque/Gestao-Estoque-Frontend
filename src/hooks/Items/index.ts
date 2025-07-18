import { axiosInstance } from '@/axios/api'
import {
  CustomQueryOptions,
  ErrorQueryOptions,
  IItems,
  Items,
} from '../../types/types'
import { useQuery } from '@tanstack/react-query'

export const useItems = (
  options?: CustomQueryOptions<IItems[], ErrorQueryOptions>,
) => {
  return useQuery<IItems[], ErrorQueryOptions>({
    queryKey: ['items'],
    queryFn: () =>
      axiosInstance.get<Items>('/api/items').then((resp) => resp.data.items),
    ...options,
  })
}

export const useItemQueryById = (
  itemId: string,
  options?: CustomQueryOptions<IItems, ErrorQueryOptions>,
) => {
  return useQuery<IItems, ErrorQueryOptions>({
    queryKey: ['itemID', itemId],
    queryFn: () =>
      axiosInstance
        .get<IItems>(`/api/items/${itemId}`)
        .then((resp) => resp.data),
    ...options,
  })
}
