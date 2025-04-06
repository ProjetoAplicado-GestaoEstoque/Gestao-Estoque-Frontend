import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

type DeleteActiosProps = {
  url: string
  id: string
}

function DataTableDeleteAction({ url, id }: DeleteActiosProps) {
  const deleteDataRow = async () => {
    try {
      await fetch(`${url}${id}`, {
        method: 'DELETE',
      }).then((resp) => {
        console.log(resp)
        /* Adicionar useMutation */
      })
    } catch (error) {
      console.log(error)
    }
  }

  return <DropdownMenuItem onClick={deleteDataRow}>Deletar</DropdownMenuItem>
}

export default DataTableDeleteAction
