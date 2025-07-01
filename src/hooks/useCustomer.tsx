/* eslint-disable react-hooks/rules-of-hooks */
import { axiosInstance } from '@/axios/api'
import { ErrorQueryOptions, ICustomer } from '../types/types'
import { QueryOptions, useQuery } from '@tanstack/react-query'

export const useCustomer = (
  options?: QueryOptions<ICustomer[], ErrorQueryOptions>,
) => {
  return useQuery<ICustomer[], ErrorQueryOptions>({
    queryKey: ['customer'],
    ...options,
    queryFn: async () =>
      await axiosInstance.get('/api/customer').then((resp) => {
        return resp.data?.customers
      }),
  })
}
