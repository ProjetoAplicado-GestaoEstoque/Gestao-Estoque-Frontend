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

export function ClientSelector() {
  const [clients, setClients] = React.useState<{ id: string; cnpj: string }[]>(
    [],
  )
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
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
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue
          placeholder={loading ? 'Carregando...' : 'Selecione um cliente'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Clientes</SelectLabel>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.cnpj}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
