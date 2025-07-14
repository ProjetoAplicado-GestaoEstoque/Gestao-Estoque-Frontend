import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'

interface User {
  id: string
  full_name: string
  role: 'tech_responsible' | 'project_manager'
  email: string
  enrollment: string
}

export function UserSelector({
  titulo,
  value,
  onChange,
  filterByRole,
}: {
  titulo: string
  value: string
  onChange: (value: string) => void
  filterByRole?: 'tech_responsible' | 'project_manager'
}) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = filterByRole
          ? `/api/user/find/role?role=${filterByRole}`
          : '/api/user/findAll'

        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
        } else {
          console.error('Erro ao buscar usuários:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [filterByRole])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue
          placeholder={loading ? 'Carregando...' : `Selecione um ${titulo}`}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{titulo}</SelectLabel>
          {users.length === 0 && !loading ? (
            <SelectItem value="" disabled>
              Nenhum {titulo.toLowerCase()} encontrado
            </SelectItem>
          ) : (
            users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{user.full_name}</span>
                  <span className="text-xs text-gray-500">
                    {user.enrollment}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
