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

export function UserSelector({
  titulo,
  value,
  onChange,
}: {
  titulo: string
  value: string
  onChange: (value: string) => void
}) {
  const [users, setUsers] = useState<{ id: string; full_name: string }[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user/findAll')
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
  }, [])

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
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <b>Nome: </b>
              {user.full_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
