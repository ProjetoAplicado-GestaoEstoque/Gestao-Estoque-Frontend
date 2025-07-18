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
  precoUnitario: number
  project: IProjects
  supplier: ISupplier
}

export interface IItemsForm {
  name: string
  storage: string
  description: string
  quantity: number
  precoUnitario: number
  project_id?: string
  supplier_id?: string
  operationType: 'entrada' | 'saída'
}

export interface ISupplier {
  id: string
  corporate_name: string
  cnpj: string
  phone: string
  email: string
  address: string
  items: IItems[]
}

export interface IStock {
  id: string
  description: string
  item: IItems
  type: string
  quantity: number
  documentUrl?: string
  documentName?: string
}

export type Supplier = {
  supplier: ISupplier[]
}

export type Items = {
  items: IItems[]
}

export type Projects = {
  projects: IProjects[]
}

export type Stock = {
  estoque: IStock[]
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
