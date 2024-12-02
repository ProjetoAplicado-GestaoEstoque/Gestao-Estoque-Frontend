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

export function UserSelector({
  titulo,
  value,
  onChange,
  users,
}: {
  titulo: string
  value: string
  onChange: (value: string) => void
  users?: { id: string; full_name: string; role: string }[]
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Selecione um ${titulo}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{titulo}</SelectLabel>
          {users && users.length > 0 ? (
            users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <b>Nome: </b>
                {user.full_name}
              </SelectItem>
            ))
          ) : (
            <p className="p-2 text-[12px]">
              {users
                ? 'Nem um registro encontrado com esse titulo'
                : 'Carregando...'}
            </p>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
