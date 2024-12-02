export type User = {
  id: string
  full_name: string
  email: string
  password: string
  enrollment: string
  role: string
  createdAt: string
  deletedAt: string | null
  updatedAt: string
}

export type Customer = {
  id: string
  cnpj: string
  email: string
  phone: string
  address: string
  createdAt: string
  deletedAt: string | null
  updatedAt: string
}

export type Project = {
  id: string
  name: string
  instituition: string
  project_manager: User
  tech_responsible: User
  customer: Customer
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type Supplier = {
  id: string
  corporate_name: string
  cnpj: string
  phone: string
  email: string
  address: string
  createdAt: string
  deletedAt: string | null
  updatedAt: string
}

export type Item = {
  id: string
  name: string
  storage: string
  quantity: string
  description: string
  Supplier: Supplier[]
  Projects: Project[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
