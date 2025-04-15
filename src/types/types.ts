/* eslint-disable no-use-before-define */
import { Roles } from '@/modules/auth/types/types'
import { UseQueryOptions } from '@tanstack/react-query'

export interface IUserCredentials {
  userID: string
  full_name: string
  email: string
  role: Roles
}

export interface ICustomer {
  id: string
  cnpj: string
  email: string
}

export interface IProjects {
  id: string
  name: string
  instituition: string
  project_manager: Omit<IUserCredentials, 'roles'>
  tech_responsible: Omit<IUserCredentials, 'roles'>
  customer: ICustomer
  description: string
}

export interface IItems {
  id: string
  name: string
  storage: string
  description: string
  quantity: number
  project: IProjects
  supplier: Supplier
}

export interface Supplier {
  id: string
  corporate_name: string
  cnpj: string
  phone: string
  email: string
  address: string
  items: IItems[]
}

export type Items = {
  items: IItems[]
}

export type Projects = {
  projects: IProjects[]
}

export interface ErrorQueryOptions extends Error {
  statusCode?: number
  message: string
}

export type CustomQueryOptions<
  TData = unknown,
  TError = ErrorQueryOptions,
  TSelected = TData,
> = Omit<UseQueryOptions<TData, TError, TSelected>, 'queryKey' | 'queryFn'>
