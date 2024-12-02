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

export function CustomerSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [clients, setClients] = useState<{ id: string; cnpj: string }[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/customer')
        if (response.ok) {
          const data = await response.json()
          setClients(data.customers)
        } else {
          console.error('Erro ao buscar clientes:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue
          placeholder={loading ? 'Carregando...' : 'Selecione um cliente'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Clientes</SelectLabel>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              <b>CNPJ:</b> {client.cnpj} <b>Email:</b> {client.cnpj}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
