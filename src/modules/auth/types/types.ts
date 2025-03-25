export enum Roles {
  tech_responsible = 'tech_responsible',
  project_manager = 'project_manager',
}

export interface ISignUp {
  full_name: string
  email: string
  password: string
  role: Roles
}

export interface ISignIn {
  email: string
  password: string
}

export interface UserToken {
  id: string
  email: string
}
