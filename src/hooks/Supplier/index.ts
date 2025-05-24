import { axiosInstance } from '@/axios/api'
import {
  CustomQueryOptions,
  ErrorQueryOptions,
  Supplier,
  ISupplier,
} from '@/types/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export const useSupplier = (
  options?: UseQueryOptions<ISupplier[], ErrorQueryOptions>,
) => {
  return useQuery<ISupplier[], ErrorQueryOptions>({
    queryKey: ['supplier'],
    queryFn: async () => {
      return await axiosInstance.get<Supplier>('/api/supplier').then((resp) => {
        return resp.data?.supplier
      })
    },
    ...options,
  })
}

export const useSupplierQueryById = (
  supplierId: string,
  options?: CustomQueryOptions<Supplier, ErrorQueryOptions>,
) => {
  return useQuery<Supplier, ErrorQueryOptions>({
    queryKey: ['supplier', supplierId],
    queryFn: () =>
      axiosInstance
        .get<Supplier>(`/api/supplier/${supplierId}`)
        .then((resp) => resp.data),
    ...options,
  })
}
