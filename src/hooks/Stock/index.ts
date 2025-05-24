import { axiosInstance } from '@/axios/api'
import { ErrorQueryOptions, Stock, IStock } from '@/types/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export const useStock = (
  options?: UseQueryOptions<IStock[], ErrorQueryOptions>,
) => {
  return useQuery<IStock[], ErrorQueryOptions>({
    queryKey: ['estoque'],
    queryFn: async () => {
      return await axiosInstance.get<Stock>('/api/estoque').then((resp) => {
        return resp.data?.estoque
      })
    },
    ...options,
  })
}
