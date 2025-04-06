import { Roles } from '@/modules/auth/types/types'

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
  createdAt: string
  deletedAt: string
}

export interface Items {
  id: string
  storage: string
  description: string
  project_id: string
  supplier_id: string
  quantity: number
  createdAt: string
  deletedAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  corporate_name: string
  cnpj: string
  phone: string
  email: string
  address: string
  items: Items[]
}

export interface ErrorQueryOptions extends Error {
  statusCode?: number
  message: string
}
